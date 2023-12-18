import { usePoolData } from "@hooks/pool/use-pool-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PositionMapper } from "@models/position/mapper/position-mapper";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useCallback, useState } from "react";
import { useGnoswapContext } from "./use-gnoswap-context";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useAtom } from "jotai";
import { PoolState } from "@states/index";
const WRAPPED_GNOT_PATH = process.env.NEXT_PUBLIC_WRAPPED_GNOT_PATH || "";

export const usePositionData = () => {
  const { positionRepository } = useGnoswapContext();
  const { account } = useWallet();
  const { pools } = usePoolData();
  const [isError, setIsError] = useState(false);
  const { gnot } = useGnotToGnot();
  const [isFetchedPosition, setIsFetchedPosition] = useState(false);
  const [positions, setPositions] = useAtom(PoolState.positions);

  const isStakedPool = useCallback(
    (poolPath: string | null) => {
      if (!poolPath) {
        return false;
      }
      const stakedPoolPaths = positions
        .filter(position => position.staked)
        .map(position => position.poolPath);
      return stakedPoolPaths.includes(poolPath);
    },
    [positions],
  );

  const getPositions = useCallback(async (): Promise<PoolPositionModel[]> => {
    if (!account?.address) {
      setPositions([]);
      return [];
    }
    if (pools.length === 0) {
      setPositions([]);
      return [];
    }
    setIsError(false);

    return positionRepository
      .getPositionsByAddress(account.address)
      .then(positions => {
        const poolPositions: PoolPositionModel[] = [];
        positions.forEach(position => {
          const pool = pools.find(pool => pool.path === position.poolPath);
          if (pool) {
            const temp = {
              ...pool,
              tokenA: {
                ...pool.tokenA,
                symbol: pool.tokenA.path === WRAPPED_GNOT_PATH ? (gnot?.symbol || "") : pool.tokenA.symbol,
                logoURI: pool.tokenA.path === WRAPPED_GNOT_PATH ? (gnot?.logoURI || "") : pool.tokenA.logoURI,
              },
              tokenB: {
                ...pool.tokenB,
                symbol: pool.tokenB.path === WRAPPED_GNOT_PATH ? (gnot?.symbol || "") : pool.tokenB.symbol,
                logoURI: pool.tokenB.path === WRAPPED_GNOT_PATH ? (gnot?.logoURI || "") : pool.tokenB.logoURI,
              }
            };
            poolPositions.push(PositionMapper.makePoolPosition(position, temp));
          }
        });
        setPositions(positions);
        setIsError(false);
        setIsFetchedPosition(true);
        return poolPositions;
      })
      .catch(() => {
        setIsFetchedPosition(true);
        setPositions([]);
        setIsError(true);
        return [];
      });
  }, [account?.address, pools, positionRepository, setPositions]);

  const getPositionsByPoolId = useCallback(
    async (poolId: string): Promise<PoolPositionModel[]> => {
      if (!account?.address) {
        return [];
      }
      if (pools.length === 0) {
        return [];
      }
      setIsError(false);

      return positionRepository
        .getPositionsByAddress(account.address)
        .then(positions => {
          const poolPositions: PoolPositionModel[] = [];
          positions.forEach(position => {
            const pool = pools.find(
              pool => pool.path === position.poolPath && pool.id === poolId,
            );
            if (pool) {
              poolPositions.push(
                PositionMapper.makePoolPosition(position, pool),
              );
            }
          });
          setIsError(false);
          return poolPositions;
        })
        .catch(() => {
          setIsError(true);
          return [];
        });
    },
    [account?.address, pools, positionRepository],
  );

  return {
    isError,
    isStakedPool,
    getPositions,
    getPositionsByPoolId,
    isFetchedPosition,
  };
};
