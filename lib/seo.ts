import type { TravelPackage } from "@/data/packages";
import type { Destination } from "@/data/destinations";
import { CONTACT } from "@/lib/constants";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://cherootholidays.com";

/**
 * Returns an absolute URL for a given relative path.
 */
export function absoluteUrl(path = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Structured data: Organization & TravelAgency
 */
export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Cheroot Holidays",
    url: SITE_URL,
    logo: absoluteUrl("/brand/cheroot-logo.png"),
    image: absoluteUrl("/brand/cheroot-logo.png"),
    description:
      "Cheroot Holidays — Discover thoughtfully planned journeys, unforgettable stays, and handcrafted holiday packages.",
    telephone: CONTACT.phone,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    sameAs: [
      "https://www.instagram.com/cherootholidays",
      "https://www.facebook.com/cherootholidays",
    ],
  };
}

/**
 * Structured data: WebSite with Sitelinks Searchbox
 */
export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Cheroot Holidays",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/packages?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Structured data: TouristTrip for individual package pages.
 * Strictly adheres to truth in advertising:
 * - Only includes pricing offer when verified (> 0).
 * - Never fabricates fake reviews or ratings.
 */
export function getPackageJsonLd(pkg: TravelPackage) {
  const hasVerifiedPrice =
    typeof pkg.price === "number" && pkg.price > 0;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.title,
    description:
      pkg.description ||
      `Explore ${pkg.destination} on a curated holiday by Cheroot Holidays.`,
    touristType: pkg.category,
    image: pkg.image ? absoluteUrl(pkg.image) : undefined,
    url: absoluteUrl(`/packages/${pkg.slug}`),
    provider: {
      "@type": "TravelAgency",
      name: "Cheroot Holidays",
      url: SITE_URL,
    },
    itinerary: {
      "@type": "ItemList",
      numberOfItems: pkg.days || 1,
      itemListElement: (pkg.highlights || []).map((h, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: h,
      })),
    },
  };

  if (hasVerifiedPrice) {
    jsonLd.offers = {
      "@type": "Offer",
      price: pkg.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01",
      url: absoluteUrl(`/packages/${pkg.slug}`),
    };
  }

  return jsonLd;
}

/**
 * Structured data: TouristDestination for destination guide pages.
 */
export function getDestinationJsonLd(destination: Destination) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    description: destination.tagline,
    containedInPlace: {
      "@type": "Country",
      name: destination.country,
    },
    image: destination.image ? absoluteUrl(destination.image) : undefined,
    url: absoluteUrl(`/destinations/${destination.slug}`),
  };
}

/**
 * Structured data: BreadcrumbList for hierarchical navigation.
 */
export function getBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * Structured data: FAQPage
 */
export function getFAQPageJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

