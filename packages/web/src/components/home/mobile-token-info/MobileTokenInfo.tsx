import React from "react";
import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { type Token } from "@containers/token-list-container/TokenListContainer";
import { cx } from "@emotion/css";
import {
  HoverSection,
  PriceValueWrapper,
  TableColumn,
  TokenInfoWrapper,
} from "./MobileTokenInfo.styles";
import { MOBILE_TOKEN_TD_WIDTH } from "@constants/skeleton.constant";
import { makeId } from "@utils/common";
import useRouter from "@hooks/common/use-custom-router";
import TokenInfoCell from "@components/common/token-info-cell/TokenInfoCell";

interface TokenInfoProps {
  item: Token;
  idx: number;
}

const renderToNegativeType = (status: MATH_NEGATIVE_TYPE, value: string) => (
  <>
    {status === MATH_NEGATIVE_TYPE.NEGATIVE ? (
      <IconTriangleArrowDown />
    ) : status === MATH_NEGATIVE_TYPE.POSITIVE ? (
      <IconTriangleArrowUp />
    ) : null}
    <span>{value}</span>
  </>
);

const MobileTokenInfo: React.FC<TokenInfoProps> = ({ item }) => {
  const { token, price, priceOf1d } = item;
  const router = useRouter();

  const onClickItem = (path: string) => {
    router.push("/tokens/" + makeId(path));
  };

  return (
    <TokenInfoWrapper>
      <HoverSection onClick={() => onClickItem(token.path)}>
        <TableColumn
          className="name-col left"
          tdWidth={MOBILE_TOKEN_TD_WIDTH[1]}
        >
          <TokenInfoCell token={token} isNative={item.isNative} />
        </TableColumn>
        <TableColumn className="price-col" tdWidth={MOBILE_TOKEN_TD_WIDTH[2]}>
          {price === "--" ? (
            <PriceValueWrapper>{price}</PriceValueWrapper>
          ) : (
            price
          )}
          <div className={cx(priceOf1d.status.toLowerCase())}>
            {renderToNegativeType(priceOf1d.status, priceOf1d.value)}
          </div>
        </TableColumn>
      </HoverSection>
    </TokenInfoWrapper>
  );
};

export default MobileTokenInfo;
