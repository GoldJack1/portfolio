import Link from "next/link";
import { getNotFoundContent } from "@/lib/site-settings";
import { sansLight, sansMedium } from "@/lib/typography";

export default function NotFound() {
  const content = getNotFoundContent();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className={`text-3xl sm:text-4xl mb-4 ${sansMedium}`}>{content.title}</h1>
      <p className={`text-muted max-w-md mb-8 ${sansLight}`}>{content.body}</p>
      <Link
        href={content.ctaHref}
        className={`inline-flex items-center justify-center px-6 h-10 rounded-full bg-surface border border-border hover:border-muted transition-colors ${sansMedium}`}
      >
        {content.ctaLabel}
      </Link>
    </div>
  );
}
