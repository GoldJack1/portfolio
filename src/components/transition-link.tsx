"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useNavigateWithScroll } from "@/hooks/use-navigate-with-scroll";

type TransitionLinkProps = ComponentProps<typeof Link>;

function resolveHref(href: TransitionLinkProps["href"]): string {
  if (typeof href === "string") return href;
  if ("pathname" in href && href.pathname) return href.pathname;
  return "/";
}

export default function TransitionLink({ href, onClick, ...props }: TransitionLinkProps) {
  const navigate = useNavigateWithScroll();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const url = resolveHref(href);
    if (!url.startsWith("/") || url.startsWith("//")) return;

    event.preventDefault();
    const query = typeof href === "object" && href && "search" in href ? href.search ?? "" : "";
    const hash = typeof href === "object" && href && "hash" in href ? href.hash ?? "" : "";
    navigate(`${url}${query}${hash}`);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
