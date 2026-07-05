"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { scrollToTopThen } from "@/lib/scroll-to-top";

function pathOnly(href: string): string {
  return href.split("?")[0].split("#")[0];
}

export function useNavigateWithScroll() {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = useCallback(
    (href: string) => {
      const samePage = pathOnly(href) === pathOnly(pathname);

      if (samePage) {
        router.push(href, { scroll: false });
        return;
      }

      scrollToTopThen(() => router.push(href, { scroll: false }));
    },
    [router, pathname],
  );

  return navigate;
}
