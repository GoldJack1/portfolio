import CmsButton from "./cms-button";
import type { CmsButton as CmsButtonType, CmsTypography } from "@/lib/cms/types";
import { typographyClassName } from "@/lib/cms/typography";

type CmsButtonRowProps = {
  buttons?: CmsButtonType[];
  className?: string;
};

export function CmsButtonRow({ buttons, className = "" }: CmsButtonRowProps) {
  const validButtons = buttons?.filter((button) => button.label && button.href);
  if (!validButtons?.length) return null;

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {validButtons.map((button) => (
        <CmsButton key={`${button.label}-${button.href}`} button={button} />
      ))}
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
  if (!content?.trim()) return null;

  return (
    <div className={`cms-markdown space-y-4 text-muted leading-relaxed ${typographyClassName(typography, defaults)} ${className}`}>
      {content.split(/\n{2,}/).map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph.trim()}</p>
      ))}
    </div>
  );
}
