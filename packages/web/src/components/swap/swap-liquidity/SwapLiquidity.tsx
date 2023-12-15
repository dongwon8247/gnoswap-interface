import React from "react";
import { SwapLiquidityWrapper } from "./SwapLiquidity.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconAdd from "@components/common/icons/IconAdd";
import {
  LiquidityInfo,
  LIQUIDITY_HEAD,
} from "@containers/swap-liquidity-container/SwapLiquidityContainer";
import Link from "next/link";
import { TokenModel } from "@models/token/token-model";

interface SwapLiquidityProps {
  liquiditys: LiquidityInfo[];
  tokenA: TokenModel;
  tokenB: TokenModel;
  createPool: () => void;
}

const getPathname = (liquidity: LiquidityInfo) => {
  if (
    liquidity.liquidity === "-" ||
    liquidity.volume === "-" ||
    liquidity.apr === "-"
  ) {
    return {
      pathname: `/earn/add?feeTier=${liquidity.feeTierType}`,
      as: "/earn/add",
    };
  }
  return {
    pathname: `/earn/pool/${liquidity.id}`,
    as: `/earn/pool/${liquidity.id}`,
  };
};

const Logo = ({ token }: { token: TokenModel }) => {
  return <>
    {token.logoURI ? <img src={token.logoURI} alt="token-logo" className="coin-logo" /> : <div className="missing-logo">{token.symbol}</div>}
  </>;
};

const SwapLiquidity: React.FC<SwapLiquidityProps> = ({
  liquiditys,
  tokenA,
  tokenB,
  createPool,
}) => {
  
  return (
    <SwapLiquidityWrapper>
      <div className="box-header">
        <div className="coin-pair">
          <div className="gnos-image-wrapper">
            <Logo token={tokenA} />
          </div>
          <div className="gnot-image-wrapper">
            <Logo token={tokenB} />
          </div>
        </div>
        <span>
          {tokenA.symbol}/{tokenB.symbol}
        </span>
      </div>
      {liquiditys.length === 0 ? (
        <div className="list-wrap">
          <p>
            No pools available for this pair. You will be the first to <br />
            add liquidity to this pair.
          </p>
          <Button
            text="Add Position"
            leftIcon={<IconAdd />}
            style={{
              fullWidth: true,
              gap: 8,
              height: 44,
              fontType: "body9",
              hierarchy: ButtonHierarchy.Primary,
            }}
            onClick={createPool}
          />
        </div>
      ) : (
        <div className="liquidity-list">
          <div className="th">
            {Object.values(LIQUIDITY_HEAD).map((head, idx) => (
              <span
                key={idx}
                className={Object.keys(LIQUIDITY_HEAD)[idx].toLowerCase()}
              >
                {head}
              </span>
            ))}
          </div>
          {liquiditys.map((liquidity, idx) => {
            const obj = getPathname(liquidity);
            return (
              <Link href={obj.pathname} as={obj.as} key={idx} className={`${!liquidity.active ? "inacitve-liquidity" : ""}`}>
                <div className={`fee-info ${!liquidity.active ? "inacitve-liquidity" : ""}`}>
                  <span className="badge-wrap">
                    <div className="badge">{liquidity.feeTier}%</div>
                  </span>
                  <span className="volume">{liquidity.volume}</span>
                  <span className="liquidity">{liquidity.liquidity}</span>
                  <span className="apr">{liquidity.apr}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </SwapLiquidityWrapper>
  );
};

export default SwapLiquidity;
