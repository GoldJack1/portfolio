import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project preview",
  robots: { index: false, follow: false },
};

export default function CmsProjectPreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
