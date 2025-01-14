import React from "react";
import LoadMoreButton from "@components/common/load-more-button/LoadMoreButton";
import MyPositionCard from "@components/common/my-position-card/MyPositionCard";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import {
  BlankPositionCard,
  CardListWrapper,
  GridWrapper,
} from "./MyPositionCardList.styles";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenPriceModel } from "@models/token/token-price-model";

interface MyPositionCardListProps {
  loadMore: boolean;
  isFetched: boolean;
  isLoading: boolean;
  onClickLoadMore?: () => void;
  positions: PoolPositionModel[];
  currentIndex: number;
  movePoolDetail: (poolId: string, positionId: string) => void;
  mobile: boolean;
  divRef?: React.RefObject<HTMLDivElement>;
  onScroll?: () => void;
  showPagination: boolean;
  showLoadMore: boolean;
  width: number;
  themeKey: "dark" | "light";
  tokenPrices: Record<string, TokenPriceModel>;
}

const MyPositionCardList: React.FC<MyPositionCardListProps> = ({
  loadMore,
  isFetched,
  isLoading,
  onClickLoadMore,
  positions,
  currentIndex,
  movePoolDetail,
  mobile,
  divRef,
  onScroll,
  showPagination,
  width,
  themeKey,
  showLoadMore,
  tokenPrices,
}) => (
  <CardListWrapper $loading={isLoading}>
    <GridWrapper ref={divRef} onScroll={onScroll} $loading={isLoading}>
      {!isLoading &&
        positions.length > 0 &&
        positions.map((position, idx) => (
          <MyPositionCard
            tokenPrices={tokenPrices}
            currentIndex={idx}
            position={position}
            key={idx}
            movePoolDetail={movePoolDetail}
            mobile={mobile}
            themeKey={themeKey}
          />
        ))}
      {isFetched &&
        !isLoading &&
        positions.length > 0 &&
        positions.length < 4 &&
        Array((width <= 1180 && width >= 768 ? 3 : 4) - positions.length)
          .fill(1)
          .map((_, index) => <BlankPositionCard key={index} />)}
      {(!isFetched && positions.length === 0) || isLoading
        ? Array.from({ length: width <= 1180 && width >= 768 ? 3 : 4 }).map(
            (_, idx) => (
              <span
                key={idx}
                className="card-skeleton"
                css={pulseSkeletonStyle({ w: "100%", tone: "600" })}
              />
            ),
          )
        : null}
    </GridWrapper>
    {!mobile && !isLoading && showLoadMore && onClickLoadMore && (
      <LoadMoreButton show={loadMore} onClick={onClickLoadMore} />
    )}

    {showPagination && isFetched && positions.length !== 0 && !isLoading && (
      <div className="box-indicator">
        <span className="current-page">{currentIndex}</span>
        <span>/</span>
        <span>{positions.length}</span>
      </div>
    )}
  </CardListWrapper>
);

export default MyPositionCardList;
