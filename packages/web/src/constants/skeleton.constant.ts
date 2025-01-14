import { css, keyframes, Theme } from "@emotion/react";
import { media } from "@styles/media";
import { CSSProperties } from "react";
import { ValuesType } from "utility-types";

const skeletonAni = keyframes`
  to {
    transform: translateX(100%);
  }
`;

const pulseAnim = keyframes`
    0% {
        opacity: 1
    }
    50% {
        opacity: 0.3;
    }
    100% {
        opacity: 1;
    }
`;

export interface PulseSkeletonParams {
  w?: CSSProperties["width"];
  h?: CSSProperties["height"];
  tabletWidth?: CSSProperties["width"];
  smallTableWidth?: CSSProperties["width"];
  mobileWidth?: CSSProperties["width"];
  type?: SHAPE_TYPES;
  tone?: "200" | "300" | "400" | "500" | "600";
}

export interface TableInfoType {
  title: TABLE_TITLE;
  total: number;
  tdWidth?: number[];
  list: List[];
}
interface List {
  width: number;
  type: SHAPE_TYPES;
  left: boolean;
  className?: string;
  skeletonWidth: number;
  hideSkeleton?: boolean;
}

const getPulseBackground = (
  tone: PulseSkeletonParams["tone"],
  theme: Theme,
) => {
  switch (tone) {
    case "200":
      return theme.color.skeleton02;
    case "300":
      return theme.color.skeleton03;
    case "400":
      theme.color.skeleton04;

    case "500":
      return theme.color.skeleton05;
    default:
      return theme.color.skeleton06;
  }
};

export const pulseSkeletonStyle = ({
  w = "100%",
  h = "18px",
  tone = "200",
  type = "rounded-square",
  tabletWidth,
  smallTableWidth,
  mobileWidth,
}: PulseSkeletonParams) => (theme: Theme) => {
  const width = typeof w === "number" ? `${w}px` : w;
  const height = typeof h === "number" ? `${h}px` : h;

  return css`
      position: relative;
      width: ${width};
      height: ${type === SHAPE_TYPES.CIRCLE ? `${width}px` : `${height}`};
      overflow: hidden;
      border-radius: ${type === SHAPE_TYPES.CIRCLE ? "50%" : "2px"};
      &::after {
        content: "";
        position: absolute;
        left: 0%;
        top: 0;
        width: 100%;
        height: 100%;
        background: ${getPulseBackground(tone, theme)};
        animation: 1.5s ease-in-out 0.5s infinite normal none running
          ${pulseAnim};
      }

      ${media.tablet} {
        width: ${tabletWidth ? `${tabletWidth}px` : tabletWidth};
        height: ${typeof height === "number" ? `${h}px` : h};
      }
      ${media.tabletMiddle} {
        width: ${smallTableWidth ? `${smallTableWidth}px` : smallTableWidth};
        height: ${typeof height === "number" ? `${h}px` : h};
      }
      ${media.mobile} {
        width: ${w};
        width: ${typeof mobileWidth === "number" ? `${mobileWidth}px` : mobileWidth
    };
        height: ${typeof height === "number" && height === 22 ? "22px" : h};
      }
    `;
};

export const skeletonStyle = (
  skeletonWidth: CSSProperties["width"],
  type: SHAPE_TYPES,
) => (theme: Theme) =>
    css`
    position: relative;
    width: ${typeof skeletonWidth === "number"
        ? `${skeletonWidth}px`
        : skeletonWidth};
    height: ${type === SHAPE_TYPES.CIRCLE ? `${skeletonWidth}px` : "18px"};
    background: ${theme.color.background01};
    overflow: hidden;
    border-radius: ${type === SHAPE_TYPES.CIRCLE ? "50%" : "2px"};
    &::after {
      content: "";
      position: absolute;
      left: 0%;
      top: 0;
      transform: translateX(-50%);
      width: 100%;
      height: 100%;
      background: linear-gradient(
        0,
        ${theme.color.backgroundGradient} 0%,
        ${theme.color.backgroundGradient} 100%
      );
      animation: ${skeletonAni} 2s ease infinite;
    }
  `;

export const skeletonTrendingStyle = (
  skeletonWidth: CSSProperties["width"],
  type: SHAPE_TYPES,
  seconds?: number,
) => (theme: Theme) =>
    css`
    position: relative;
    width: ${typeof skeletonWidth === "number"
        ? `${skeletonWidth}px`
        : skeletonWidth};
    height: 25px;
    background: ${theme.color.background23};
    overflow: hidden;
    border-radius: ${type === SHAPE_TYPES.CIRCLE ? "50%" : "2px"};
    &::after {
      content: "";
      position: absolute;
      left: 0%;
      top: 0;
      transform: translateX(-100%);
      width: 100%;
      height: 100%;
      background: linear-gradient(
        0,
        ${theme.color.backgroundGradient} 0%,
        ${theme.color.backgroundGradient} 100%
      );
      animation: ${skeletonAni} ${seconds ? seconds : "3"}s ease infinite;
    }
  `;

export const skeletonTokenDetail = (
  skeletonWidth: CSSProperties["width"],
  type: SHAPE_TYPES,
  seconds?: number,
  tabletWidth?: CSSProperties["width"],
  smallTableWidth?: CSSProperties["width"],
) => (theme: Theme) =>
    css`
    position: relative;
    width: ${typeof skeletonWidth === "number"
        ? `${skeletonWidth}px`
        : skeletonWidth};
    height: 22px;
    overflow: hidden;
    border-radius: ${type === SHAPE_TYPES.CIRCLE ? "50%" : "2px"};
    z-index: 1;
    &::after {
      content: "";
      position: absolute;
      left: 0%;
      top: 0;
      transform: translateX(-100%);
      width: 100%;
      height: 100%;
      background: ${theme.color.backgroundGradient6};
      animation: ${skeletonAni} ${seconds ? seconds : "3"}s ease infinite;
    }
    ${media.tablet} {
      width: ${tabletWidth
        ? `${tabletWidth}px`
        : typeof skeletonWidth === "number"
          ? `${skeletonWidth}px`
          : skeletonWidth};
    }
    ${media.tabletMiddle} {
      width: ${smallTableWidth
        ? `${smallTableWidth}px`
        : typeof skeletonWidth === "number"
          ? `${skeletonWidth}px`
          : skeletonWidth};
    }
    ${media.mobile} {
      width: ${typeof skeletonWidth === "number"
        ? `${skeletonWidth}px`
        : skeletonWidth};
      height: 18px;
    }
  `;

export const skeletonTotalBalance = (
  skeletonWidth: CSSProperties["width"],
  type: SHAPE_TYPES,
  seconds?: number,
) => (theme: Theme) =>
    css`
    position: relative;
    width: ${typeof skeletonWidth === "number"
        ? `${skeletonWidth}px`
        : skeletonWidth};
    height: 20px;
    overflow: hidden;
    border-radius: ${type === SHAPE_TYPES.CIRCLE ? "50%" : "2px"};
    z-index: 1;
    &::after {
      content: "";
      position: absolute;
      left: 0%;
      top: 0;
      transform: translateX(-100%);
      width: 100%;
      height: 100%;
      background: ${theme.color.backgroundGradient6};
      animation: ${skeletonAni} ${seconds ? seconds : "3"}s ease infinite;
    }
    ${media.mobile} {
      height: 18px;
    }
  `;

export const skeletonBalanceDetail = (
  skeletonWidth: CSSProperties["width"],
  type: SHAPE_TYPES,
  seconds?: number,
) => (theme: Theme) =>
    css`
    position: relative;
    width: ${typeof skeletonWidth === "number"
        ? `${skeletonWidth}px`
        : skeletonWidth};
    height: 20px;
    overflow: hidden;
    border-radius: ${type === SHAPE_TYPES.CIRCLE ? "50%" : "2px"};
    z-index: 1;
    &::after {
      content: "";
      position: absolute;
      left: 0%;
      top: 0;
      transform: translateX(-100%);
      width: 100%;
      height: 100%;
      background: ${theme.color.backgroundGradient6};
      animation: ${skeletonAni} ${seconds ? seconds : "3"}s ease infinite;
    }
    ${media.mobile} {
      height: 18px;
    }
  `;



export const TOKEN_SEARCH_WIDTH = [400];
export const TOKEN_TD_WIDTH = [
  56,
  199,
  105,
  85,
  85,
  85,
  140,
  140,
  138,
  201,
  124,
];
export const MOBILE_TOKEN_TD_WIDTH = [160, 160];

export const LEADERBOARD_TD_WIDTH = [120, 400, 200, 200, 200, 240];
export const MOBILE_LEADERBOARD_TD_WIDTH = [50, 150, 128];
export const TABLET_LEADERBOARD_TD_WIDTH = [120, 300, 170, 170, 170, 170];

export const SHAPE_TYPES = {
  CIRCLE: "circle",
  ROUNDED_SQUARE: "rounded-square",
  NONE: "none",
} as const;
export type SHAPE_TYPES = ValuesType<typeof SHAPE_TYPES>;

export const TABLE_TITLE = {
  POOL_TABLE: "pool-table",
  ASSET_TABLE: "asset-table",
  TOKEN_TABLE: "token-table",
  ACTIVITY_TABLE: "activity-table",
  LEADERBOARD_TABLE: "leaderboard-table",
  POSITION_HISTORY: "position-history-table",
};
export type TABLE_TITLE = ValuesType<typeof TABLE_TITLE>;

export const emptyArrayInit = (total: number) => {
  return [...new Array(total)].map((_, i) => i + 1);
};

export const POOL_INFO = {
  title: TABLE_TITLE.POOL_TABLE,
  total: 15,
  // tdWidth: POOL_TD_WIDTH,
  list: [
    { width: 240, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true, skeletonWidth: 161 },
    { width: 190, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 120 },
    { width: 190, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 120 },
    { width: 190, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 120 },
    { width: 170, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 80 },
    { width: 180, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 102 },
    { width: 198, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 102 },
  ],
};

export const POOL_INFO_SMALL_TABLET = {
  title: TABLE_TITLE.POOL_TABLE,
  total: 15,
  // tdWidth: POOL_TD_WIDTH_SMALL_TABLET,
  list: [
    { width: 185, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true, skeletonWidth: 185 },
    { width: 110, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 110 },
    { width: 110, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 110 },
    { width: 100, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 100 },
    { width: 80, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 80 },
    { width: 104, type: SHAPE_TYPES.CIRCLE, left: false, skeletonWidth: 20 },
    { width: 160, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 160 },
  ],
};

export const POOL_INFO_TABLET = {
  title: TABLE_TITLE.POOL_TABLE,
  total: 15,
  // tdWidth: POOL_TD_WIDTH_TABLET,
  list: [
    { width: 199, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true, skeletonWidth: 161 },
    { width: 150, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 120 },
    { width: 150, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 120 },
    { width: 150, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 120 },
    { width: 140, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 120 },
    { width: 150, type: SHAPE_TYPES.CIRCLE, left: false, skeletonWidth: 20 },
    { width: 160, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 102 },
  ],
};

export const POOL_INFO_MOBILE = {
  title: TABLE_TITLE.POOL_TABLE,
  total: 15,
  // tdWidth: POOL_TD_WIDTH_MOBILE,
  list: [
    { width: 210, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true, skeletonWidth: 140 },
    { width: 110, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 110 },
    { width: 140, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 140 },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 120 },
    { width: 100, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 100 },
    { width: 106, type: SHAPE_TYPES.CIRCLE, left: false, skeletonWidth: 20 },
    { width: 160, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 160 },
  ],
};

// export const ASSET_TD_WIDTH = [300, 300, 250, 250, 120, 138];
// export const TABLET_ASSET_TD_WIDTH = [220, 240, 190, 190, 120, 138];
// export const MOBILE_ASSET_TD_WIDTH = [230, 230, 195, 195, 90, 120];

export const ASSET_INFO: TableInfoType = {
  title: TABLE_TITLE.ASSET_TABLE,
  total: 15,
  list: [
    {
      width: 300,
      skeletonWidth: 161,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      className: ""
    },
    {
      width: 300,
      skeletonWidth: 161,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      className: ""
    },
    {
      width: 250,
      skeletonWidth: 161,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      className: "left-padding",
    },
    {
      width: 250,
      skeletonWidth: 161,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      className: "left-padding",
    },
    {
      width: 120,
      skeletonWidth: 120,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "left-padding",
      hideSkeleton: true,
    },
    {
      width: 138,
      skeletonWidth: 138,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "left-padding",
      hideSkeleton: true,
    },
  ],
};

export const ASSET_INFO_TABLET: TableInfoType = {
  title: TABLE_TITLE.ASSET_TABLE,
  total: 15,
  list: [
    {
      width: 220,
      skeletonWidth: 120,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true
    },
    {
      width: 240,
      skeletonWidth: 120,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      className: "padding-12",
    },
    {
      width: 190,
      skeletonWidth: 120,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      className: "left-padding",
    },
    {
      width: 190,
      skeletonWidth: 120,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      className: "left-padding",
    },
    {
      width: 120,
      skeletonWidth: 120,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "left-padding",
      hideSkeleton: true,
    },
    {
      width: 138,
      skeletonWidth: 138,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "left-padding",
      hideSkeleton: true,
    },
  ],
};

export const ASSET_INFO_MOBILE: TableInfoType = {
  title: TABLE_TITLE.ASSET_TABLE,
  total: 15,
  list: [
    {
      width: 230,
      skeletonWidth: 120,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true
    },
    {
      width: 230,
      skeletonWidth: 120,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true
    },
    {
      width: 195,
      skeletonWidth: 120,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      className: "left-padding",
    },
    {
      width: 195,
      skeletonWidth: 120,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      className: "left-padding",
    },
    {
      width: 90,
      skeletonWidth: 90,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "left-padding",
      hideSkeleton: true,
    },
    {
      width: 120,
      skeletonWidth: 120,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "left-padding",
      hideSkeleton: true,
    },
  ],
};

export const TOKEN_INFO = {
  title: TABLE_TITLE.TOKEN_TABLE,
  total: 15,
  tdWidth: TOKEN_TD_WIDTH,
  list: [
    {
      width: 10,
      skeletonWidth: 10,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      className: "",
    },
    {
      width: 199,
      skeletonWidth: 199,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      className: "left-padding",
    },
    {
      width: 105,
      skeletonWidth: 105,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right-padding-16",
    },
    {
      width: 85,
      skeletonWidth: 85,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right-padding-16",
    },
    {
      width: 85,
      skeletonWidth: 85,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right-padding-16",
    },
    {
      width: 85,
      skeletonWidth: 85,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right-padding-16",
    },
    {
      width: 140,
      skeletonWidth: 140,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right-padding-16",
    },
    {
      width: 140,
      skeletonWidth: 140,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right-padding-12",
    },
    {
      width: 138,
      skeletonWidth: 138,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right-padding-12",
    },
    {
      width: 201,
      skeletonWidth: 201,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right-padding-12",
    },
    {
      width: 124,
      skeletonWidth: 124,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right-padding-12",
    },
  ],
};

export const LEADER_INFO = {
  title: TABLE_TITLE.LEADERBOARD_TABLE,
  total: 15,
  tdWidth: LEADERBOARD_TD_WIDTH,
  list: [
    {
      width: 120 / 4,
      skeletonWidth: 120 / 4,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      className: "center",
    },
    {
      width: 400 / 2,
      skeletonWidth: 400 / 2,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
    },
    {
      width: 200 / 2,
      skeletonWidth: 200 / 2,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
    },
    {
      width: 200 / 2,
      skeletonWidth: 200 / 2,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
    },
    {
      width: 200 / 2,
      skeletonWidth: 200 / 2,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
    },
    {
      width: 240 / 3,
      skeletonWidth: 240 / 3,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "padding-50",
    },
  ],
};

export const TABLET_LEADER_INFO = {
  title: TABLE_TITLE.LEADERBOARD_TABLE,
  total: 15,
  tdWidth: LEADERBOARD_TD_WIDTH,
  list: [
    {
      width: 120 / 4,
      skeletonWidth: 120 / 4,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      className: "center",
    },
    {
      width: 300 / 2,
      skeletonWidth: 300 / 2,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
    },
    {
      width: 170 / 2,
      skeletonWidth: 170 / 2,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
    },
    {
      width: 170 / 2,
      skeletonWidth: 170 / 2,

      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
    },
    {
      width: 170 / 2,
      skeletonWidth: 170 / 2,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
    },
    {
      width: 170 / 3,
      skeletonWidth: 170 / 3,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "padding-50",
    },
  ],
};

export const MOBILE_LEADER_INFO = {
  title: TABLE_TITLE.LEADERBOARD_TABLE,
  total: 15,
  tdWidth: MOBILE_LEADERBOARD_TD_WIDTH,
  list: [
    {
      width: 50 / 2,
      skeletonWidth: 50 / 2,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false
    },
    {
      width: 150,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "flex-grow start",
      skeletonWidth: 150,
    },
    {
      width: 128,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      skeletonWidth: 120,
    },
  ],
};

export const MOBILE_TOKEN_INFO = {
  title: TABLE_TITLE.TOKEN_TABLE,
  total: 15,
  tdWidth: MOBILE_TOKEN_TD_WIDTH,
  list: [
    {
      width: 120,
      skeletonWidth: 120,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true
    },
    {
      width: 120,
      skeletonWidth: 120,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false
    },
  ],
};

export const TOKEN_SEARCH_INFO = {
  title: TABLE_TITLE.TOKEN_TABLE,
  total: 3,
  tdWidth: TOKEN_SEARCH_WIDTH,
  list: [{ width: 400, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false }],
};


export const ACTIVITY_INFO = {
  title: TABLE_TITLE.ACTIVITY_TABLE,
  total: 15,
  list: [
    { width: 240, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true, skeletonWidth: 161 },
    { width: 230, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 120 },
    { width: 230, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 120 },
    { width: 230, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 120 },
    { width: 230, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 80 },
    { width: 198, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 80 },
  ],
};

export const LEADERBOARD_INFO = {
  title: TABLE_TITLE.LEADERBOARD_TABLE,
  total: 15,
  tdWidth: LEADERBOARD_TD_WIDTH,
  list: [
    { width: 161, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true, skeletonWidth: 161 },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 120 },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 120 },
    { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 120 },
    { width: 80, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 80 },
    { width: 80, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 80 },
  ],
};


export const POSITION_HISTORY_INFO: TableInfoType = {
  title: TABLE_TITLE.POSITION_HISTORY,
  total: 5,
  list: [
    { width: 280, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true, skeletonWidth: 150 },
    { width: 280, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true, skeletonWidth: 150 },
    {
      width: 266,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right",
      skeletonWidth: 120,
    },
    {
      width: 266,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right",
      skeletonWidth: 120,
    },
    {
      width: 265,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right",
      skeletonWidth: 120,
    },
  ],
};


export const TABLET_POSITION_HISTORY_INFO: TableInfoType = {
  title: TABLE_TITLE.POSITION_HISTORY,
  total: 5,
  list: [
    {
      width: 280,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      skeletonWidth: 224
    },
    {
      width: 240,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      skeletonWidth: 184
    },
    {
      width: 140,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right",
      skeletonWidth: 84
    },
    {
      width: 220,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right",
      skeletonWidth: 164
    },
    {
      width: 218,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right",
      skeletonWidth: 162,
    },
  ],
};

export const MOBILE_POSITION_HISTORY_INFO: TableInfoType = {
  title: TABLE_TITLE.POSITION_HISTORY,
  total: 5,
  list: [
    {
      width: 160,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      skeletonWidth: 132
    },
    {
      width: 150,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: true,
      skeletonWidth: 122
    },
    {
      width: 120,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right",
      skeletonWidth: 92,
    },
    {
      width: 153,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right",
      skeletonWidth: 125,
    },
    {
      width: 151,
      type: SHAPE_TYPES.ROUNDED_SQUARE,
      left: false,
      className: "right",
      skeletonWidth: 123,
    },
  ],
};

// export const MOBILE_ACTIVITY_TD_WIDTH = [210, 110, 140, 140, 160, 200];

export const MOBILE_ACTIVITY_INFO = {
  title: TABLE_TITLE.ACTIVITY_TABLE,
  total: 15,
  list: [
    { width: 210, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true, skeletonWidth: 161, },
    { width: 110, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 120, className: "right-padding-16" },
    { width: 140, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 120, className: "right-padding-16" },
    { width: 140, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 120, className: "right-padding-16" },
    { width: 160, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 80, className: "right-padding-16" },
    { width: 198, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, skeletonWidth: 80 },
  ],
};
