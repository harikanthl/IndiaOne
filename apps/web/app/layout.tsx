import type { Metadata, Viewport } from "next";
import { Anek_Bangla, Anek_Devanagari, Anek_Kannada, Anek_Latin, Anek_Tamil, Anek_Telugu, Mukta } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LanguageProvider } from "@/components/Language";
import { themeScript } from "@/lib/theme";
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

// Only used by the multilingual approval stamp, so they are not preloaded.
const hi = Anek_Devanagari({ subsets: ["devanagari"], axes: ["wdth"], variable: "--font-hi", display: "swap", preload: false });
const ta = Anek_Tamil({ subsets: ["tamil"], axes: ["wdth"], variable: "--font-ta", display: "swap", preload: false });
const kn = Anek_Kannada({ subsets: ["kannada"], axes: ["wdth"], variable: "--font-kn", display: "swap", preload: false });
const bn = Anek_Bangla({ subsets: ["bengali"], axes: ["wdth"], variable: "--font-bn", display: "swap", preload: false });

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#16120e" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${telugu.variable} ${body.variable} ${hi.variable} ${ta.variable} ${kn.variable} ${bn.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <LanguageProvider>
          <a className="skip" href="#main">
            Skip to content
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
