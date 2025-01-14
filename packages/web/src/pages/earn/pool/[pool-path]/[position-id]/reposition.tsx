import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import RepositionContainer from "@containers/reposition-container/RepositionContainer";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import RepositionLayout from "@layouts/reposition/RepositionLayout";
import { DeviceSize } from "@styles/media";
import useRouter from "@hooks/common/use-custom-router";
import { useMemo } from "react";
import { useGetPoolDetailByPath } from "src/react-query/pools";
import SEOHeader from "@components/common/seo-header/seo-header";
import { SEOInfo } from "@constants/common.constant";

export default function EarnAdd() {
  const { width } = useWindowSize();
  const router = useRouter();
  const poolPath = router.query["pool-path"] || "";
  const positionId = router.query["position-id"] || "";
  const { data, isLoading } = useGetPoolDetailByPath(poolPath as string, {
    enabled: !!poolPath,
  });
  const { getGnotPath } = useGnotToGnot();
  const { isLoading: isLoadingCommon } = useLoading();

  const listBreadcrumb = useMemo(() => {
    return [
      { title: "Earn", path: "/earn" },
      {
        title:
          width > DeviceSize.mediumWeb
            ? `${getGnotPath(data?.tokenA).symbol}/${
                getGnotPath(data?.tokenB).symbol
              } (${Number(data?.fee) / 10000}%)`
            : "...",
        path: `/earn/pool/${router.query["pool-path"]}`,
      },
      { title: "Reposition", path: "" },
    ];
  }, [data, width]);

  const seoInfo = useMemo(
    () => SEOInfo["/earn/pool/[pool-path]/[position-id]/reposition"],
    [],
  );

  return (
    <>
      <SEOHeader
        title={seoInfo.title([positionId as string])}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo?.ogTitle?.()}
        ogDescription={seoInfo?.ogDesc?.()}
      />
      <RepositionLayout
        header={<HeaderContainer />}
        breadcrumbs={
          <BreadcrumbsContainer
            listBreadcrumb={listBreadcrumb}
            isLoading={isLoadingCommon || isLoading}
          />
        }
        reposition={<RepositionContainer />}
        footer={<Footer />}
      />
    </>
  );
}
