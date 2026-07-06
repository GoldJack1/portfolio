"use client";

import Icon from "@/components/ui/icon";
import TransitionLink from "@/components/transition-link";
import { sansLight } from "@/lib/typography";

type CmsBackLinkProps = {
  label?: string;
  href?: string;
  className?: string;
};

export default function CmsBackLink({
  label = "Back",
  href = "/",
  className = "",
}: CmsBackLinkProps) {
  return (
    <TransitionLink
      href={href}
      className={`inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8 ${sansLight} ${className}`}
    >
      <Icon name="chevron-left" size={16} />
      <span>{label}</span>
    </TransitionLink>
  );
}
