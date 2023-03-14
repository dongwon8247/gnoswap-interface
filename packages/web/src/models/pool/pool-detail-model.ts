import BigNumber from "bignumber.js";
import { PoolModel } from "./pool-model";

export interface PoolDetailModel extends PoolModel {
	apr: number;

	volumn24h: BigNumber;

	fees24h: BigNumber;
}