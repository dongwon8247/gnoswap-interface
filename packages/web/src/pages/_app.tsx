import { useState } from "react";
import type { AppProps } from "next/app";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { Provider as JotaiProvider } from "jotai";
import GnoswapModalProvider from "@providers/gnoswap-modal-provider/GnoswapModalProvider";
import ModalContainer from "@containers/modal-container/ModalContainer";
import GnoswapServiceProvider from "@providers/gnoswap-service-provider/GnoswapServiceProvider";
import BackgroundContainer from "@containers/background-container/BackgroundContainer";
import Notice from "@components/common/notice/NoticeToast";
import ScrollTopWrapper from "@components/common/scroll-top-wrapper/ScrollTopWrapper";
import ErrorBoundary from "@components/common/error-boundary/ErrorBoundary";
import Custom500 from "./500";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchInterval: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <JotaiProvider>
          <GnoswapServiceProvider>
            <GnoswapThemeProvider>
              <BackgroundContainer>
                <Notice>
                  <ScrollTopWrapper>
                    <ErrorBoundary fallback={<Custom500 />}>
                      <Component {...pageProps} />
                    </ErrorBoundary>
                  </ScrollTopWrapper>
                  <GnoswapModalProvider selector={"portal-root"}>
                    <ModalContainer />
                  </GnoswapModalProvider>
                </Notice>
              </BackgroundContainer>
            </GnoswapThemeProvider>
          </GnoswapServiceProvider>
        </JotaiProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}
