export interface RemoveLiquidityRequest {
  lpTokenIds: string[];

  tokenPaths: string[];

  caller: string;

  existWrappedToken: boolean;
}
