import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/ui/BackToTop";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { SITE_URL, getOrganizationJsonLd, getWebSiteJsonLd } from "@/lib/seo";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cheroot Holidays — Explore · Experience · Enjoy",
    template: "%s · Cheroot Holidays",
  },
  description:
    "Discover thoughtfully planned journeys, unforgettable stays, and experiences built around the way you want to travel.",
  icons: { icon: "/brand/cheroot-logo.png" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Cheroot Holidays",
    title: "Cheroot Holidays — Explore · Experience · Enjoy",
    description:
      "Discover thoughtfully planned journeys, unforgettable stays, and experiences built around the way you want to travel.",
    images: [
      {
        url: "/brand/cheroot-logo.png",
        width: 1200,
        height: 630,
        alt: "Cheroot Holidays — Explore · Experience · Enjoy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cheroot Holidays — Explore · Experience · Enjoy",
    description:
      "Discover thoughtfully planned journeys, unforgettable stays, and experiences built around the way you want to travel.",
    images: ["/brand/cheroot-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const organizationJsonLd = getOrganizationJsonLd();
  const webSiteJsonLd = getWebSiteJsonLd();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <BackToTop />
        </LanguageProvider>
      </body>
    </html>
  );
}
