import React, { useCallback, useMemo } from "react";
import { CopyTooltip, wrapper } from "./TokenSwap.styles";
import IconSettings from "@components/common/icons/IconSettings";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import IconLink from "@components/common/icons/IconLink";
import IconPolygon from "@components/common/icons/IconPolygon";
import { TokenModel } from "@models/token/token-model";
import { DataTokenInfo } from "@models/token/token-swap-model";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import SwapCardContentDetail from "@components/swap/swap-card-content-detail/SwapCardContentDetail";
import BigNumber from "bignumber.js";
import { roundDownDecimalNumber } from "@utils/regex";
import { PriceImpactStatus } from "@hooks/swap/use-swap-handler";
import { SwapTokenInfo } from "@models/swap/swap-token-info";

export interface TokenSwapProps {
  isSwitchNetwork: boolean;
  connected: boolean;
  copied: boolean;
  themeKey: "dark" | "light";
  dataTokenInfo: DataTokenInfo;
  isLoading: boolean;
  swapButtonText: string;
  isAvailSwap: boolean;
  swapSummaryInfo: SwapSummaryInfo | null;
  swapRouteInfos: SwapRouteInfo[];
  swapTokenInfo: SwapTokenInfo;

  swapNow: () => void;
  handleSetting: () => void;
  handleCopied: () => void;
  connectWallet: () => void;
  changeTokenA: (token: TokenModel) => void;
  changeTokenAAmount: (value: string, none?: boolean) => void;
  changeTokenB: (token: TokenModel) => void;
  changeTokenBAmount: (value: string, none?: boolean) => void;
  switchSwapDirection: () => void;
  setSwapRateAction: (type: "ATOB" | "BTOA") => void;
  priceImpactStatus: PriceImpactStatus;
}

function isAmount(str: string) {
  const regex = /^\d+(\.\d*)?$/;
  return regex.test(str);
}

const TokenSwap: React.FC<TokenSwapProps> = ({
  connected,
  connectWallet,
  swapNow,
  copied,
  handleCopied,
  themeKey,
  handleSetting,
  isSwitchNetwork,
  dataTokenInfo,
  changeTokenA,
  changeTokenAAmount,
  changeTokenB,
  changeTokenBAmount,
  switchSwapDirection,
  isLoading,
  swapButtonText,
  isAvailSwap,
  swapSummaryInfo,
  swapRouteInfos,
  setSwapRateAction,
  priceImpactStatus,
  swapTokenInfo,
}) => {
  const tokenA = dataTokenInfo.tokenA;
  const tokenB = dataTokenInfo.tokenB;
  const direction = swapSummaryInfo?.swapDirection;

  const onChangeTokenAAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "") {
        changeTokenAAmount("", true);
      }
      if (value !== "" && !isAmount(value)) return;
      changeTokenAAmount(value.replace(/^0+(?=\d)|(\.\d*)$/g, "$1"));
    },
    [changeTokenAAmount],
  );

  const onChangeTokenBAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "") {
        changeTokenBAmount("", true);
      }
      if (value !== "" && !isAmount(value)) return;
      changeTokenBAmount(value.replace(/^0+(?=\d)|(\.\d*)$/g, "$1"));
    },
    [changeTokenBAmount],
  );

  const handleAutoFillTokenA = useCallback(() => {
    if (connected) {
      const formatValue = parseFloat(
        dataTokenInfo.tokenABalance.replace(/,/g, ""),
      ).toString();
      changeTokenAAmount(formatValue);
    }
  }, [changeTokenAAmount, connected, dataTokenInfo]);

  const handleAutoFillTokenB = useCallback(() => {
    if (connected) {
      const formatValue = parseFloat(
        dataTokenInfo.tokenBBalance.replace(/,/g, ""),
      ).toString();
      changeTokenBAmount(formatValue);
    }
  }, [changeTokenBAmount, connected, dataTokenInfo]);

  const onClickConfirm = useCallback(() => {
    if (!connected || isSwitchNetwork) {
      connectWallet();
      return;
    }
    swapNow();
  }, [connected, connectWallet, swapNow, isSwitchNetwork]);

  const isShowInfoSection = useMemo(() => {
    return (
      (!!Number(dataTokenInfo.tokenAAmount) &&
        !!Number(dataTokenInfo.tokenBAmount)) ||
      isLoading
    );
  }, [dataTokenInfo, isLoading]);

  const balanceADisplay = useMemo(() => {
    if (isSwitchNetwork) return "-";
    if (connected && dataTokenInfo.tokenABalance !== "-") {
      if (dataTokenInfo.tokenABalance === "0") return 0;
      return BigNumber(
        dataTokenInfo.tokenABalance
          .replace(/,/g, "")
          .match(roundDownDecimalNumber(2))
          ?.toString() ?? 0,
      ).toFormat(2);
    }
    return "-";
  }, [isSwitchNetwork, connected, dataTokenInfo.tokenABalance]);

  const balanceBDisplay = useMemo(() => {
    if (isSwitchNetwork) return "-";
    if (connected && dataTokenInfo.tokenBBalance !== "-") {
      if (dataTokenInfo.tokenBBalance === "0") return 0;
      return BigNumber(
        dataTokenInfo.tokenBBalance
          .replace(/,/g, "")
          .match(roundDownDecimalNumber(2))
          ?.toString() ?? 0,
      ).toFormat(2);
    }
    return "-";
  }, [dataTokenInfo.tokenBBalance, connected, isSwitchNetwork]);

  return (
    <div css={wrapper}>
      <div className="header">
        <span className="title">Swap</span>
        <div className="header-button">
          <button className="setting-button link-button" onClick={handleCopied}>
            <IconLink className="setting-icon" />
            {copied && (
              <CopyTooltip>
                <div className={`box ${themeKey}-shadow`}>
                  <span>Swap URL Copied!</span>
                </div>
                <IconPolygon className="polygon-icon" />
              </CopyTooltip>
            )}
          </button>
          <button className="setting-button" onClick={handleSetting}>
            <IconSettings className="setting-icon" />
          </button>
        </div>
      </div>
      <div className="inputs">
        <div className="from">
          <div className="amount">
            <input
              className={`amount-text ${
                isLoading && direction !== "EXACT_IN" ? "text-opacity" : ""
              }`}
              value={dataTokenInfo.tokenAAmount}
              onChange={onChangeTokenAAmount}
              placeholder="0"
            />
            <div className="token">
              <SelectPairButton token={tokenA} changeToken={changeTokenA} />
            </div>
          </div>
          <div className="info">
            <span
              className={`price-text ${
                isLoading && direction !== "EXACT_IN" ? "text-opacity" : ""
              }`}
            >
              {dataTokenInfo.tokenAUSDStr}
            </span>
            <span
              className={`balance-text ${
                tokenA && connected && "balance-text-disabled"
              }`}
              onClick={handleAutoFillTokenA}
            >
              Balance: {balanceADisplay}
            </span>
          </div>
        </div>
        <div className="to">
          <div className="amount">
            <input
              className={`amount-text ${
                isLoading && direction === "EXACT_IN" ? "text-opacity" : ""
              }`}
              value={dataTokenInfo.tokenBAmount}
              onChange={onChangeTokenBAmount}
              placeholder="0"
            />
            <div className="token">
              <SelectPairButton token={tokenB} changeToken={changeTokenB} />
            </div>
          </div>
          <div className="info">
            <span
              className={`price-text ${
                isLoading && direction === "EXACT_IN" ? "text-opacity" : ""
              }`}
            >
              {dataTokenInfo.tokenBUSDStr}
            </span>
            <span
              className={`balance-text ${
                tokenB && connected && "balance-text-disabled"
              }`}
              onClick={handleAutoFillTokenB}
            >
              Balance: {balanceBDisplay}
            </span>
          </div>
        </div>
        <div className="arrow" onClick={switchSwapDirection}>
          <div className="shape">
            <IconSwapArrowDown className="shape-icon" />
          </div>
        </div>
      </div>
      {swapSummaryInfo && isShowInfoSection && (
        <SwapCardContentDetail
          swapSummaryInfo={swapSummaryInfo}
          swapRouteInfos={swapRouteInfos}
          isLoading={isLoading}
          setSwapRateAction={setSwapRateAction}
          priceImpactStatus={priceImpactStatus}
          swapTokenInfo={swapTokenInfo}
        />
      )}
      <div className="footer">
        <Button
          text={swapButtonText}
          style={{
            fullWidth: true,
            hierarchy: ButtonHierarchy.Primary,
          }}
          disabled={!isAvailSwap}
          onClick={onClickConfirm}
          className="confirm-button"
        />
      </div>
    </div>
  );
};

export default TokenSwap;
