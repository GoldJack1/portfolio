import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeProvider from "@/components/theme-provider";
import ThemeInitScript from "@/components/theme-init-script";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PageTransition from "@/components/page-transition";

const strawford = localFont({
  src: "../fonts/Strawford-Regular.otf",
  variable: "--font-strawford",
  display: "swap",
});

const knile = localFont({
  src: "../fonts/Knile-Regular.otf",
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
      suppressHydrationWarning
    >
      <head>
        <ThemeInitScript />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider>
          <header className="fixed top-0 left-0 right-0 z-50 px-6 pt-6 sm:px-12 sm:pt-8 flex flex-col items-stretch max-sm:isolate max-sm:[transform:translateZ(0)] pointer-events-auto max-sm:touch-manipulation">
            <SiteHeader />
          </header>
          <main className="relative z-0 flex-1 flex flex-col pt-[123px] sm:pt-[155px] overflow-x-clip">
            <PageTransition>{children}</PageTransition>
          </main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
