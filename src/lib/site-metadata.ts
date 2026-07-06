import type { Metadata } from "next";
import { getDefaultOgImage, getSiteDescription, getSiteName } from "@/lib/site-settings";
import { getSiteUrl } from "@/lib/site-config";

type PageMetadataOptions = {
  description?: string;
  ogImage?: string;
};

export function createPageMetadata(title: string, options?: string | PageMetadataOptions): Metadata {
  const resolved =
    typeof options === "string" ? { description: options } : (options ?? {});
  const description = resolved.description ?? getSiteDescription();
  const ogImage = resolved.ogImage ?? getDefaultOgImage();
  const siteName = getSiteName();

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: getSiteName(),
    template: `%s | ${getSiteName()}`,
  },
  description: getSiteDescription(),
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: getSiteName(),
    title: getSiteName(),
    description: getSiteDescription(),
    ...(getDefaultOgImage() ? { images: [{ url: getDefaultOgImage()! }] } : {}),
  },
  twitter: {
    card: getDefaultOgImage() ? "summary_large_image" : "summary",
    title: getSiteName(),
    description: getSiteDescription(),
    ...(getDefaultOgImage() ? { images: [getDefaultOgImage()!] } : {}),
  },
};

export function createCmsPageMetadata(
  title: string,
  seoTitle?: string,
  seoDescription?: string,
  ogImage?: string,
): Metadata {
  return createPageMetadata(seoTitle?.trim() || title, {
    description: seoDescription,
    ogImage,
  });
}

export function sitePageMetadata(
  page: { title: string; seoTitle?: string; seoDescription?: string; ogImage?: string } | null,
  fallbackTitle: string,
): Metadata {
  if (!page) return createPageMetadata(fallbackTitle);
  return createCmsPageMetadata(page.title, page.seoTitle, page.seoDescription, page.ogImage);
}
