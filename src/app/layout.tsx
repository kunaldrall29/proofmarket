import type { Metadata, Viewport } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { cn } from "@/lib/utils";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "MED-Health Locker",
    template: "%s · MED-Health Locker",
  },
  description:
    "Personal health records with calm, trustworthy AI analysis — reports, trends, and care services in one place.",
  appleWebApp: {
    capable: true,
    title: "MED-Health Locker",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#f7f4ef",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  const loggedIn = !!session?.user;

  return (
    <html lang="en">
      <body
        className={cn(
          display.variable,
          body.variable,
          "antialiased flex min-h-dvh flex-col",
        )}
      >
        <SiteHeader />
        <main className={cn("flex-1", loggedIn && "pb-24 md:pb-0")}>{children}</main>
        {loggedIn ? <MobileBottomNav /> : null}
        <SiteFooter />
      </body>
    </html>
  );
}
