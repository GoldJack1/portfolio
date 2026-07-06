import TransitionLink from "@/components/transition-link";
import type { CmsButton, CmsTypography } from "@/lib/cms/types";
import { typographyClassName } from "@/lib/cms/typography";
import { sansBold } from "@/lib/typography";

type CmsButtonRowProps = {
  buttons?: CmsButton[];
  className?: string;
};

export function CmsButtonRow({ buttons, className = "" }: CmsButtonRowProps) {
  const validButtons = buttons?.filter((button) => button.label && button.href);
  if (!validButtons?.length) return null;

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {validButtons.map((button) => {
        const href = button.href!;
        const isExternal = /^https?:\/\//i.test(href);
        const classes = `px-6 py-3 rounded-full text-[15px] transition-opacity ${sansBold} ${
          button.variant === "secondary"
            ? "border border-border text-foreground hover:bg-surface transition-colors"
            : "bg-foreground text-background hover:opacity-80"
        }`;

        if (isExternal) {
          return (
            <a
              key={`${button.label}-${href}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={classes}
            >
              {button.label}
            </a>
          );
        }

        return (
          <TransitionLink key={`${button.label}-${href}`} href={href} className={classes}>
            {button.label}
          </TransitionLink>
        );
      })}
    </div>
  );
}

type CmsMarkdownProps = {
  content: string;
  typography?: CmsTypography;
  defaults?: Partial<CmsTypography>;
  className?: string;
};

export function CmsMarkdown({
  content,
  typography,
  defaults,
  className = "",
}: CmsMarkdownProps) {
  const proseClass = typographyClassName(typography, defaults);

  return (
    <div
      className={`cms-markdown space-y-4 text-muted leading-relaxed ${proseClass} ${className}`}
    >
      {content.split(/\n{2,}/).map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph.trim()}</p>
      ))}
    </div>
  );
}
