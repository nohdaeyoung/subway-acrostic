import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WebAppJsonLd, FaqJsonLd } from "@/components/JsonLd";
import AdminScripts from "@/components/AdminScripts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://m.324.ing";

// Dark mode init script — runs before first paint to prevent FOUC
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})();`;

// Verification codes are set via Vercel environment variables.
// GOOGLE_SITE_VERIFICATION and NAVER_SITE_VERIFICATION
// These are read at build time and baked into the static HTML,
// so search engine crawlers can always find them.
const gVerify = process.env.GOOGLE_SITE_VERIFICATION;
const nVerify = process.env.NAVER_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "지하철 N행시 — 서울·부산 지하철역 삼행시 모음",
    template: "%s | 지하철 N행시",
  },
  description:
    "서울·부산 700개 이상 지하철역 이름으로 쓴 N행시를 노선도 위에서 감상하세요. 삼행시·사행시를 직접 작성하고 공유할 수 있습니다.",
  keywords: [
    "N행시", "삼행시", "사행시", "지하철", "서울지하철",
    "부산지하철", "지하철역", "언어유희", "역이름", "노선도",
  ],
  authors: [{ name: "지하철 N행시", url: BASE_URL }],
  creator: "지하철 N행시",
  publisher: "지하철 N행시",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: BASE_URL,
    siteName: "지하철 N행시",
    title: "지하철 N행시 — 서울·부산 지하철역 삼행시 모음",
    description: "서울·부산 700개 이상 지하철역 이름으로 쓴 N행시를 노선도 위에서 감상하세요.",
    images: [{ url: `${BASE_URL}/og`, width: 1200, height: 630, alt: "지하철 N행시" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "지하철 N행시 — 서울·부산 지하철역 삼행시",
    description: "서울·부산 700개 이상 지하철역 이름으로 쓴 N행시를 노선도 위에서 감상하세요.",
    creator: "@subway_nacrostic",
    images: [`${BASE_URL}/og`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  ...(gVerify || nVerify
    ? {
        verification: {
          ...(gVerify ? { google: gVerify } : {}),
          ...(nVerify ? { other: { "naver-site-verification": nVerify } } : {}),
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Dark mode init — must run before paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AdminScripts />
        <WebAppJsonLd />
        <FaqJsonLd />
        {children}
      </body>
    </html>
  );
}
