import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CMS preview",
  robots: { index: false, follow: false },
};

export default function CmsPreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
