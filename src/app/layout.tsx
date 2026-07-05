import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeProvider from "@/components/theme-provider";
import ThemeInitScript from "@/components/theme-init-script";
import HeaderContrastProvider from "@/components/header-contrast-provider";
import HeaderContrastObserver from "@/components/header-contrast-observer";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PageTransition from "@/components/page-transition";

const strawford = localFont({
  src: [
    { path: "../fonts/Strawford-Light.otf", weight: "300", style: "normal" },
    { path: "../fonts/Strawford-Medium.otf", weight: "500", style: "normal" },
    { path: "../fonts/Strawford-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-strawford",
  display: "swap",
});

const knile = localFont({
  src: [
    { path: "../fonts/Knile-Light.otf", weight: "300", style: "normal" },
    { path: "../fonts/Knile-Medium.otf", weight: "500", style: "normal" },
    { path: "../fonts/Knile-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-knile",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "My portfolio site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${strawford.variable} ${knile.variable} h-full antialiased`}
      data-header-on="light"
      data-header-mixed="false"
      suppressHydrationWarning
    >
      <head>
        <ThemeInitScript />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider>
          <HeaderContrastProvider>
            <HeaderContrastObserver />
            <header className="fixed top-0 left-0 right-0 z-50 px-6 pt-6 sm:px-12 sm:pt-8 flex flex-col items-stretch pointer-events-auto max-sm:touch-manipulation">
              <SiteHeader />
            </header>
            <main className="relative z-0 flex-1 flex flex-col pt-[123px] sm:pt-[155px] overflow-x-clip">
              <PageTransition>{children}</PageTransition>
            </main>
            <SiteFooter />
          </HeaderContrastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
