"use client";

import Icon from "@/components/ui/icon";
import TransitionLink from "@/components/transition-link";
import { iconWeightFromClass } from "@/lib/icons/icon-weight-from-class";
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
      className={`icon-text-row gap-1.5 text-sm leading-none text-muted hover:text-foreground transition-colors mb-8 ${sansLight} ${className}`}
    >
      <Icon name="chevron-left" font="sans" weight={iconWeightFromClass(sansLight)} />
      <span>{label}</span>
    </TransitionLink>
  );
}
