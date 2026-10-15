import type { Metadata, Viewport } from "next";
import { Anek_Latin, Anek_Telugu, Mukta } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const display = Anek_Latin({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});

const telugu = Anek_Telugu({
  subsets: ["telugu"],
  axes: ["wdth"],
  variable: "--font-telugu",
  display: "swap",
});

const body = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "India Business One",
  description:
    "Enter an address anywhere in India. See every licence your business needs, the official fee, the law behind it, and who has your file until it is approved.",
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${telugu.variable} ${body.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
