import { useEffect } from "react";
import { useBreadcrumb } from "../context/breadcrumb-context";

export function usePageInfo(
  name: string,
  breadcrumbs: { label: string; href?: string }[]
) {
  const { setPageName, setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setPageName(name);
    setBreadcrumbs(breadcrumbs);
  }, [name, breadcrumbs, setPageName, setBreadcrumbs]);
}
