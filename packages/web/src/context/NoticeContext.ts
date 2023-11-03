import { createContext } from "react";

export type TNoticeType = "success" | "error";

export interface INoticeOptions {
  type?: TNoticeType;
  timeout?: number;
  closeable?: boolean;
  onClose?: () => void;
}

export interface INoticeContext {
  setNotice: (content: any, options?: INoticeOptions) => void;
  onCloseNotice: () => void;
}

export const NoticeContext = createContext<INoticeContext>({
  setNotice: () => {
    console.error("Calling notice without notice context");
  },
  onCloseNotice: () => {
    console.log("Close notice");
  },
});