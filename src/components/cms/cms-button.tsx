"use client";

import Icon, { type StrokeIconName } from "@/components/ui/icon";
import TransitionLink from "@/components/transition-link";
import type { CmsButton } from "@/lib/cms/types";
import { isCmsIconName } from "@/lib/cms/icon-names";
import { BUTTON_SIZE_CLASSES } from "@/lib/cms/typography";
import { iconWeightFromClass } from "@/lib/icons/icon-weight-from-class";
import { sansBold } from "@/lib/typography";

type CmsButtonProps = {
  button: CmsButton;
  className?: string;
};

export default function CmsButton({ button, className = "" }: CmsButtonProps) {
  if (!button.href) return null;

  const size = button.size ?? "md";
  const variant = button.variant ?? "primary";
  const iconPosition = button.iconPosition ?? "left";
  const iconName = isCmsIconName(button.icon) ? (button.icon as StrokeIconName) : undefined;

  const classes = `icon-text-row justify-center rounded-full transition-opacity ${sansBold} ${BUTTON_SIZE_CLASSES[size]} ${
    variant === "ghost"
      ? "text-foreground hover:bg-surface"
      : variant === "secondary"
        ? "border border-border text-foreground hover:bg-surface transition-colors"
        : "bg-foreground text-background hover:opacity-80"
  } ${className}`;

  const content = (
    <>
      {iconName && iconPosition === "left" ? (
        <Icon name={iconName} font="sans" weight={iconWeightFromClass(sansBold)} />
      ) : null}
      <span>{button.label}</span>
      {iconName && iconPosition === "right" ? (
        <Icon name={iconName} font="sans" weight={iconWeightFromClass(sansBold)} />
      ) : null}
    </>
  );

  const isExternal = /^https?:\/\//i.test(button.href);

  if (isExternal) {
    return (
      <a href={button.href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <TransitionLink href={button.href} className={classes}>
      {content}
    </TransitionLink>
  );
}
