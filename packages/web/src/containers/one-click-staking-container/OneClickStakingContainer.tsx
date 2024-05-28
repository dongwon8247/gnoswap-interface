import OneClickStaking from "@components/stake/one-click-staking/OneClickStaking";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useWallet } from "@hooks/wallet/use-wallet";
import { usePositionData } from "@hooks/common/use-position-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useAtom } from "jotai";
import { EarnState } from "@states/index";
import { makeId } from "@utils/common";
import { initialPool } from "@containers/pool-pair-information-container/PoolPairInformationContainer";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { useGetPoolDetailByPath } from "@query/pools";

const OneClickStakingContainer: React.FC = () => {
  const router = useRouter();
  const { account, connected } = useWallet();
  const [currentPoolPath] = useAtom(EarnState.currentPoolPath);
  const [{ isLoading: isLoadingRPCPoolInfo }] = useAtom(EarnState.poolInfoQuery);
  const { getPositionsByPoolId, getPositionsByPoolPath, loading: isLoadingPosition } = usePositionData({ isClosed: false });
  const [positions, setPositions] = useState<PoolPositionModel[]>([]);

  const poolId = router.query?.["pool-path"] === undefined ? null : `${router.query?.["pool-path"]}`;
  const poolPath = currentPoolPath;
  const { data = initialPool as PoolDetailModel, isLoading: isLoadingPoolInfo } = useGetPoolDetailByPath(poolPath as string, { enabled: !!poolPath });

  useEffect(() => {
    if (isLoadingRPCPoolInfo) {
      setPositions([]);
    }
  }, [isLoadingRPCPoolInfo]);

  const stakedPositions = useMemo(() => {
    if (!poolPath || !account || !connected) return [];
    return positions.filter(position => position.staked);
  }, [poolPath, account, connected, positions]);

  const unstakedPositions = useMemo(() => {
    if (!poolPath || !account || !connected) return [];
    return positions.filter(position => !position.staked);
  }, [poolPath, account, connected, positions]);

  const handleClickGotoStaking = useCallback(() => {
    if (poolId) {
      router.push(`/earn/pool/${poolId}/stake`);
      return;
    }
    if (poolPath) {
      const poolId = makeId(poolPath);
      router.push(`/earn/pool/${poolId}/stake`);
    }
  }, [poolId, poolPath, router]);

  useEffect(() => {
    if (!account?.address) {
      return;
    }
    if (poolId) {
      setPositions(getPositionsByPoolId(poolId));
      return;
    }

    if (poolPath) {
      setPositions(getPositionsByPoolPath(poolPath));
    }
  }, [account?.address, poolId, poolPath]);

  return (
    <OneClickStaking
      stakedPositions={stakedPositions}
      unstakedPositions={unstakedPositions}
      handleClickGotoStaking={handleClickGotoStaking}
      pool={data}
      isLoadingPool={isLoadingRPCPoolInfo || isLoadingPoolInfo || isLoadingPosition}
    />
  );
};
export default OneClickStakingContainer;