import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MyLiquidity from "@components/pool/my-liquidity/MyLiquidity";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useRouter } from "next/router";
import { usePositionData } from "@hooks/common/use-position-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { usePosition } from "@hooks/common/use-position";
import { useLoading } from "@hooks/common/use-loading";



const MyLiquidityContainer: React.FC = () => {
  const router = useRouter();
  const divRef = useRef<HTMLDivElement | null>(null);
  const { breakpoint } = useWindowSize();
  const { connected: connectedWallet, isSwitchNetwork, account } = useWallet();
  const [currentIndex, setCurrentIndex] = useState(1);
  const [positions, setPositions] = useState<PoolPositionModel[]>([]);
  const { getPositionsByPoolId, loading } = usePositionData();
  const { isLoadingCommon } = useLoading();
  const { claimAll } = usePosition(positions);
  const [loadngTransactionClaim, setLoadingTransactionClaim] = useState(false);
  const [isShowClosePosition, setIsShowClosedPosition] = useState(false);


  const availableRemovePosition = useMemo(() => {
    if (!connectedWallet || isSwitchNetwork) {
      return false;
    }
    return positions.length > 0;
  }, [connectedWallet, isSwitchNetwork, positions.length]);

  const handleClickAddPosition = useCallback(() => {
    router.push(`${router.asPath}/add`);
  }, [router]);

  const handleClickRemovePosition = useCallback(() => {
    router.push(`${router.asPath}/remove`);
  }, [router]);

  const handleScroll = () => {
    if (divRef.current) {
      const currentScrollX = divRef.current.scrollLeft;
      setCurrentIndex(Math.floor(currentScrollX / divRef.current.offsetWidth) + 1);
    }
  };

  const claimAllReward = useCallback(() => {
    setLoadingTransactionClaim(true);
    claimAll().then(response => {
      if (response !== null) {
        setLoadingTransactionClaim(false);
        router.reload();
      } else {
        setLoadingTransactionClaim(false);
      }
    });
  }, [claimAll, router, setLoadingTransactionClaim]);

  useEffect(() => {
    const poolPath = router.query["pool-path"] as string;
    if (!poolPath) {
      return;
    }
    if (!connectedWallet) {
      setPositions([]);
    }
    if (account?.address) {
      const temp = getPositionsByPoolId(poolPath);
      if (temp.length > 0 && isShowClosePosition) {
        const fake = {
          ...temp[0],
          status: true,
          balance: 0,
          balanceUSD: 0,
          claimableAmount: 0,
          claimableUSD: 0,
          accumulatedRewardOf1d: 0,
          aprOf7d: 0,
          claimableUsdValue: 0,
          rewards: [],
          positionUsdValue: "0",
          token0Balance: 0n,
          token1Balance: 0n,
        };
        setPositions([...temp, fake, fake]);
        return;
      }
      setPositions(temp);
    }

  }, [account?.address, router.query, setPositions, getPositionsByPoolId, isShowClosePosition, connectedWallet]);
  
  const handleSetIsClosePosition = () => {
    setIsShowClosedPosition(!isShowClosePosition);
  };

  return (
    <MyLiquidity
      positions={positions}
      breakpoint={breakpoint}
      connected={connectedWallet}
      isSwitchNetwork={isSwitchNetwork}
      handleClickAddPosition={handleClickAddPosition}
      handleClickRemovePosition={handleClickRemovePosition}
      divRef={divRef}
      onScroll={handleScroll}
      currentIndex={currentIndex}
      claimAll={claimAllReward}
      availableRemovePosition={availableRemovePosition}
      loading={loading || isLoadingCommon}
      loadngTransactionClaim={loadngTransactionClaim}
      isShowClosePosition={isShowClosePosition}
      handleSetIsClosePosition={handleSetIsClosePosition}
    />
  );
};

export default MyLiquidityContainer;