import React, { useMemo } from "react";
import { AutoRouterWrapper, DotLine } from "./SwapCardAutoRouter.styles";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { useTokenImage } from "@hooks/token/use-token-image";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";

interface ContentProps {
  swapRouteInfos: SwapRouteInfo[];
  swapSummaryInfo: SwapSummaryInfo;
  isLoading: boolean;
}

const SwapCardAutoRouter: React.FC<ContentProps> = ({
  swapRouteInfos,
  swapSummaryInfo,
  isLoading,
}) => {
  const bestGasFee = useMemo(() => {
    const totalGasFee = swapRouteInfos.reduce(
      (prev, current) => prev + current.gasFeeUSD,
      0,
    );
    return `$${totalGasFee}`;
  }, [swapRouteInfos]);

  return (
    <AutoRouterWrapper>
      {isLoading ? (
        <LoadingSpinner className="loading-spin" />
      ) : (
        <>
          {swapRouteInfos.map((swapRouteInfo, index) => (
            <SwapCardAutoRouterItem
              key={index}
              swapRouteInfo={swapRouteInfo}
              swapSummaryInfo={swapSummaryInfo}
            />
          ))}
          <p className="gas-description">
            {`Best price route costs ~${bestGasFee} in gas. This route optimizes your total output by considering split routes, multiple hops, and the gas cost of each step.`}
          </p>
        </>
      )}
    </AutoRouterWrapper>
  );
};

interface SwapCardAutoRouterItemProps {
  swapRouteInfo: SwapRouteInfo;
  swapSummaryInfo: SwapSummaryInfo;
}

const SwapCardAutoRouterItem: React.FC<SwapCardAutoRouterItemProps> = ({
  swapRouteInfo,
  swapSummaryInfo,
}) => {
  const { getTokenImage, getTokenSymbol } = useTokenImage();

  const weightStr = useMemo(() => {
    return `${swapRouteInfo.weight}%`;
  }, [swapRouteInfo.weight]);

  const routeInfos = useMemo(() => {
    let currentFromToken = swapSummaryInfo.tokenA.path;
    return swapRouteInfo.pools.map(pool => {
      const ordered = currentFromToken === pool.tokenAPath;
      const fromToken = ordered ? pool.tokenAPath : pool.tokenBPath;
      const toToken = ordered ? pool.tokenBPath : pool.tokenAPath;
      currentFromToken = toToken;
      return {
        fee: `${(pool.fee / 10000).toFixed(2)}%`,
        fromToken,
        toToken,
      };
    });
  }, [swapRouteInfo.pools, swapSummaryInfo.tokenA.path]);

  return (
    <div className="row">
      <MissingLogo
        symbol={swapSummaryInfo.tokenA.symbol}
        url={swapSummaryInfo.tokenA.logoURI}
        className="token-logo"
        width={24}
        mobileWidth={24}
      />
      <div className="left-box">
        {/* {routeInfos.length < 3 && <div className="left-badge">{swapRouteInfo.version}</div>} */}
        <span>{weightStr}</span>
      </div>
      <DotLine />
      {routeInfos.map((routeInfo, index) => (
        <React.Fragment key={`pool-${index}`}>
          <div className="pair-fee">
            <DoubleLogo
              left={getTokenImage(routeInfo.fromToken) || ""}
              right={getTokenImage(routeInfo.toToken) || ""}
              size={16}
              leftSymbol={getTokenSymbol(routeInfo.fromToken) || ""}
              rightSymbol={getTokenSymbol(routeInfo.toToken) || ""}
            />
            <h1>{routeInfo.fee}</h1>
          </div>
          {index < 2 && <DotLine />}
        </React.Fragment>
      ))}
      <MissingLogo
        symbol={swapSummaryInfo.tokenB.symbol}
        url={swapSummaryInfo.tokenB.logoURI}
        className="token-logo"
        width={24}
        mobileWidth={24}
      />
    </div>
  );
};

export default SwapCardAutoRouter;
