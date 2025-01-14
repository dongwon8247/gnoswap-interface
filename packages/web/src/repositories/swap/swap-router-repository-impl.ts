import { WalletClient } from "@common/clients/wallet-client";
import { SwapRouterRepository } from "./swap-router-repository";
import { makeRouteKey, makeRoutesQuery } from "@utils/swap-route-utils";
import { GnoProvider } from "@gnolang/gno-js-client";
import { CommonError } from "@common/errors";
import { SwapError } from "@common/errors/swap";
import { EstimateSwapRouteRequest } from "./request/estimate-swap-route-request";
import { SwapRouteRequest } from "./request/swap-route-request";
import { EstimateSwapRouteResponse } from "./response/estimate-swap-route-response";
import { PoolRPCModel } from "@models/pool/pool-rpc-model";
import BigNumber from "bignumber.js";
import { makeDisplayTokenAmount, makeRawTokenAmount } from "@utils/token-utils";
import { MAX_UINT64 } from "@utils/math.utils";
import { isNativeToken } from "@models/token/token-model";
import {
  makeDepositMessage,
  makeWithdrawMessage,
} from "@common/clients/wallet-client/transaction-messages/token";
import {
  makePoolTokenApproveMessage,
  makeRouterTokenApproveMessage,
} from "@common/clients/wallet-client/transaction-messages/pool";
import {
  SendTransactionSuccessResponse,
  WalletResponse,
} from "@common/clients/wallet-client/protocols";
import { WrapTokenRequest } from "./request/wrap-token-request";
import { TokenError } from "@common/errors/token";
import { UnwrapTokenRequest } from "./request/unwrap-token-request";
import { SwapRouteResponse } from "./response/swap-route-response";
import { TransactionMessage } from "@common/clients/wallet-client/transaction-messages";
import { checkGnotPath, toNativePath } from "@utils/common";
import { NetworkClient } from "@common/clients/network-client";
import { EstimatedRoute } from "@models/swap/swap-route-info";
import { PACKAGE_ROUTER_PATH } from "@constants/environment.constant";

const ROUTER_PACKAGE_PATH = PACKAGE_ROUTER_PATH;

export class SwapRouterRepositoryImpl implements SwapRouterRepository {
  private rpcProvider: GnoProvider | null;
  private networkClient: NetworkClient | null;
  private walletClient: WalletClient | null;
  private pools: PoolRPCModel[];

  constructor(
    rpcProvider: GnoProvider | null,
    walletClient: WalletClient | null,
    networkClient: NetworkClient | null,
  ) {
    this.rpcProvider = rpcProvider;
    this.walletClient = walletClient;
    this.pools = [];
    this.networkClient = networkClient;
  }

  public updatePools(pools: PoolRPCModel[]) {
    this.pools = pools;
  }

  public estimateSwapRoute = async (
    request: EstimateSwapRouteRequest,
  ): Promise<EstimateSwapRouteResponse> => {
    const { inputToken, outputToken, exactType, tokenAmount } = request;

    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    if (BigNumber(tokenAmount).isNaN()) {
      throw new SwapError("INVALID_PARAMS");
    }

    const inputTokenPath = checkGnotPath(inputToken.path);
    const outputTokenPath = checkGnotPath(outputToken.path);

    const tokenAmountRaw =
      exactType === "EXACT_IN"
        ? makeRawTokenAmount(inputToken, tokenAmount)
        : makeRawTokenAmount(inputToken, tokenAmount);

    const response = await this.networkClient.post<
      {
        inputTokenPath: string;
        outputTokenPath: string;
        exactType: string;
        amount: number;
      },
      EstimateSwapRouteResponse
    >({
      url: "routes",
      body: {
        inputTokenPath,
        outputTokenPath,
        exactType,
        amount: Number(tokenAmountRaw || 0),
      },
    });

    if (response.status !== 201) {
      throw new SwapError("SWAP_FAILED");
    }

    const estimatedRoutes = response.data.estimatedRoutes.map(
      makeEstimatedRouteWithRouteKey,
    );

    return { ...response.data, estimatedRoutes };
  };

  public swapRoute = async (
    request: SwapRouteRequest,
  ): Promise<WalletResponse<SwapRouteResponse>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data || !ROUTER_PACKAGE_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const { address } = account.data;
    const {
      inputToken,
      outputToken,
      exactType,
      tokenAmount,
      estimatedRoutes,
      tokenAmountLimit,
    } = request;

    const targetToken = exactType === "EXACT_IN" ? inputToken : outputToken;
    const resultToken = exactType === "EXACT_IN" ? outputToken : inputToken;
    const tokenAmountRaw = makeRawTokenAmount(targetToken, tokenAmount) || "0";
    const tokenAmountLimitRaw =
      makeRawTokenAmount(resultToken, tokenAmountLimit) || "0";
    const routesQuery = makeRoutesQuery(estimatedRoutes, inputToken.path);
    const quotes = estimatedRoutes.map(route => route.quote).join(",");

    const inputTokenWrappedPath = checkGnotPath(inputToken.path);
    const outputTokenWrappedPath = checkGnotPath(outputToken.path);

    const inputTokenPath = toNativePath(inputTokenWrappedPath);
    const outputTokenPath = toNativePath(outputTokenWrappedPath);

    const approveMessages: TransactionMessage[] = [
      makePoolTokenApproveMessage(
        inputTokenWrappedPath,
        MAX_UINT64.toString(),
        address,
      ),
      makeRouterTokenApproveMessage(
        inputTokenWrappedPath,
        MAX_UINT64.toString(),
        address,
      ),
      makeRouterTokenApproveMessage(
        outputTokenWrappedPath,
        MAX_UINT64.toString(),
        address,
      ),
    ];

    const sendTokenAmount =
      exactType === "EXACT_IN" ? tokenAmountRaw : tokenAmountLimitRaw;

    const send = inputTokenPath === "gnot" ? `${sendTokenAmount}ugnot` : "";

    const swapMessage = {
      caller: address,
      send,
      pkg_path: ROUTER_PACKAGE_PATH,
      func: "SwapRoute",
      args: [
        inputTokenPath,
        outputTokenPath,
        `${tokenAmountRaw || 0}`,
        exactType,
        `${routesQuery}`,
        `${quotes}`,
        exactType === "EXACT_IN" ? "0" : MAX_UINT64.toString(), // slippage: tokenAmountLimitRaw.toString(),
      ],
    };

    const messages = [...approveMessages, swapMessage];
    const response = await this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });
    if (response.code !== 0 || !response.data) {
      return {
        ...response,
        data: null,
      };
    }
    const data = response.data as SendTransactionSuccessResponse<string[]>;
    if (data.data === null || data.data.length === 0) {
      return {
        ...response,
        data: {
          hash: data.hash,
          height: data.height,
          resultToken,
          resultAmount: "0",
          slippageAmount: "0",
        },
      };
    }

    // XXX: log swap result
    console.log("[SWAP RESULT]", response.data);

    const result = exactType === "EXACT_IN" ? data.data[1] : data.data[0];
    const resultAmount =
      makeDisplayTokenAmount(
        resultToken,
        BigNumber(result).abs().toString(),
      )?.toString() || "0";
    const slippageAmount =
      makeDisplayTokenAmount(
        resultToken,
        sendTokenAmount.toString(),
      )?.toString() || "0";

    return {
      ...response,
      data: {
        hash: data.hash,
        height: data.height,
        resultToken,
        resultAmount: resultAmount,
        slippageAmount,
      },
    };
  };

  public wrapToken = async (request: WrapTokenRequest): Promise<WalletResponse> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data || !ROUTER_PACKAGE_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const { address } = account.data;
    const { token, tokenAmount } = request;

    const tokenAmountRaw = makeRawTokenAmount(token, tokenAmount) || "0";

    const messages = [];
    if (!isNativeToken(token)) {
      throw new TokenError("FAILED_WRAP_TOKEN");
    }
    messages.push(
      makeDepositMessage(token.wrappedPath, tokenAmountRaw, "ugnot", address),
    );
    const response = await this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });
    return {
      ...response,
    };
  };

  public unwrapToken = async (request: UnwrapTokenRequest): Promise<WalletResponse> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data || !ROUTER_PACKAGE_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const { address } = account.data;
    const { token, tokenAmount } = request;

    const tokenPath = isNativeToken(token) ? token.wrappedPath : token.path;
    const tokenAmountRaw = makeRawTokenAmount(token, tokenAmount) || "0";

    const messages = [];
    messages.push(makeWithdrawMessage(tokenPath, tokenAmountRaw, address));
    const response = await this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });
    return response;
  };
}

function makeEstimatedRouteWithRouteKey(
  estimatedRoute: EstimatedRoute,
): EstimatedRoute {
  const routeKey = makeRouteKey(estimatedRoute);
  return { ...estimatedRoute, routeKey };
}
