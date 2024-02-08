import { useForceRefetchQuery } from "@hooks/common/useForceRefetchQuery";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { CardListPoolInfo } from "@models/common/card-list-item-info";
import { PoolCardInfo } from "@models/pool/info/pool-card-info";
import { PoolListInfo } from "@models/pool/info/pool-list-info";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { QUERY_KEY, useGetPoolList } from "@query/pools";
import { PoolState } from "@states/index";
import { useAtom } from "jotai";
import { useMemo } from "react";

export const usePoolData = () => {
  const { data: pools = [], isLoading: loading, isFetched: isFetchedPools } = useGetPoolList();
  const forceRefect = useForceRefetchQuery();
  
  const [isFetchedPositions, setIsFetchedPositions] = useAtom(
    PoolState.isFetchedPositions,
  );
  const { gnot, wugnotPath, getGnotPath } = useGnotToGnot();

  const poolListInfos = useMemo(() => {
    const temp = pools?.map(PoolMapper.toListInfo);
    return temp.map((item: PoolListInfo) => {
      return {
        ...item,
        tokenA: item.tokenA
          ? {
              ...item.tokenA,
              symbol: getGnotPath(item.tokenA).symbol,
              logoURI: getGnotPath(item.tokenA).logoURI,
              name: getGnotPath(item.tokenA).name,
            }
          : item.tokenA,
        tokenB: item.tokenB
          ? {
              ...item.tokenB,
              symbol: getGnotPath(item.tokenB).symbol,
              logoURI: getGnotPath(item.tokenB).logoURI,
              name: getGnotPath(item.tokenB).name,
            }
          : item.tokenB,
      };
    });
  }, [pools, wugnotPath, gnot]);

  const higestAPRs: CardListPoolInfo[] = useMemo(() => {
    const sortedTokens = pools
      .sort((p1, p2) => {
        const p2Apr = p2.apr || 0;
        const p1Apr = p1.apr || 0;
        return Number(p2Apr) - Number(p1Apr);
      })
      .filter((_, index) => index < 3);
    return sortedTokens?.map(pool => ({
      pool: {
        ...pool,
        tokenA: {
          ...pool.tokenA,
          symbol: getGnotPath(pool.tokenA).symbol,
          logoURI: getGnotPath(pool.tokenA).logoURI,
          name: getGnotPath(pool.tokenA).name,
        },
        tokenB: {
          ...pool.tokenB,
          symbol: getGnotPath(pool.tokenB).symbol,
          logoURI: getGnotPath(pool.tokenB).logoURI,
          name: getGnotPath(pool.tokenB).name,
        },
      },
      upDown: "none",
      content: !pool.apr ? "-" : `${pool.apr || 0}%`,
    }));
  }, [pools]);

  async function updatePositions() {
    setIsFetchedPositions(true);
  }

  const incentivizedPools: PoolCardInfo[] = useMemo(() => {
    const mappedPools = pools
      .filter(pool => pool.incentivizedType !== "NONE_INCENTIVIZED")
      .map(PoolMapper.toCardInfo);
    mappedPools.sort((x, y) => Number(y.tvl) - Number(x.tvl));
    return mappedPools.map((item: PoolCardInfo) => {
      return {
        ...item,
        tokenA: {
          ...item.tokenA,
          symbol: getGnotPath(item.tokenA).symbol,
          logoURI: getGnotPath(item.tokenA).logoURI,
          name: getGnotPath(item.tokenA).name,
        },
        tokenB: {
          ...item.tokenB,
          symbol: getGnotPath(item.tokenB).symbol,
          logoURI: getGnotPath(item.tokenB).logoURI,
          name: getGnotPath(item.tokenB).name,
        },
      };
    });
  }, [pools, gnot]);

  async function updatePools() {
    forceRefect({queryKey: [QUERY_KEY.pools]});
  }

  return {
    isFetchedPools,
    higestAPRs,
    isFetchedPositions,
    pools,
    poolListInfos,
    incentivizedPools,
    updatePools,
    updatePositions,
    loading,
    gnot,
  };
};
