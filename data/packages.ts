import type { DestinationCategory } from "@/data/destinations";

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

/**
 * Data-verification status for a package record.
 *
 * - "demo"      : Starter/example record — prices, ratings, and counts have NOT
 *                  been confirmed by the client. Display with appropriate caveats.
 * - "verified"  : All key fields confirmed by Cheroot Holidays business owner.
 * - "draft"     : Real package, partially verified — some fields still pending.
 */
export type DataStatus = "demo" | "verified" | "draft";

export type TravelPackage = {
  /** URL-safe unique identifier — must be stable and never reused. */
  slug: string;
  title: string;
  destination: string;
  destinationSlug: string;
  category: DestinationCategory;
  /** Nights count — omit when unverified. */
  nights?: number;
  /** Days count — omit when unverified. */
  days?: number;
  /**
   * Verified starting price in INR.
   * Omit entirely when unconfirmed.
   * NEVER set to 0 — use undefined to trigger enquiry-first display.
   */
  price?: number;
  /**
   * Verified average rating (0–5 scale).
   * Omit entirely when not backed by real reviews.
   */
  rating?: number;
  /**
   * Number of reviews behind the rating.
   * Must be present when rating is present.
   */
  reviews?: number;
  /** Optional promotional badge label shown on the card. */
  badge?: string;
  /**
   * Short highlights list — shown as chips on the card.
   * Keep to 3 items maximum for layout consistency.
   */
  highlights?: string[];
  /** Short description for the detail page and SEO meta. */
  description?: string;
  /**
   * Main card image — relative to /public (e.g. "/packages/dubai.webp").
   * Must resolve to a real file. Use PLACEHOLDER_IMAGE as fallback.
   */
  image: string;
  /**
   * Travel styles / traveller personas suitable for this package
   * e.g. ["family", "honeymoon", "couple", "adventure", "backpacker", "luxury", "group"]
   */
  travelStyles?: string[];
  /** Additional gallery images for the detail page. */
  gallery?: string[];
  /**
   * Data provenance flag — controls UI treatment of unverified values.
   * Defaults to "demo" when omitted.
   */
  dataStatus?: DataStatus;
};

// ---------------------------------------------------------------------------
// Fallback / placeholder
// ---------------------------------------------------------------------------

/**
 * Shown when a package's main image path cannot be resolved.
 * This is a known-good SVG gradient — never shows a broken-image state.
 */
export const PLACEHOLDER_IMAGE = "/brand/placeholder-package.svg";

// ---------------------------------------------------------------------------
// Runtime validation helpers
// ---------------------------------------------------------------------------

function validatePackages(pkgs: TravelPackage[]): TravelPackage[] {
  const seenSlugs = new Set<string>();
  for (const pkg of pkgs) {
    if (seenSlugs.has(pkg.slug)) {
      console.error(
        `[packages] Duplicate slug detected: "${pkg.slug}". Fix data/packages.ts.`,
      );
    }
    seenSlugs.add(pkg.slug);

    if (pkg.price !== undefined && (typeof pkg.price !== "number" || pkg.price <= 0)) {
      console.error(
        `[packages] Invalid price for "${pkg.slug}": ${pkg.price}. Remove or fix.`,
      );
    }

    if (pkg.rating !== undefined && (pkg.rating < 0 || pkg.rating > 5)) {
      console.error(
        `[packages] Invalid rating for "${pkg.slug}": ${pkg.rating}. Must be 0–5.`,
      );
    }

    if (pkg.rating !== undefined && pkg.reviews === undefined) {
      console.error(
        `[packages] Rating present without reviews for "${pkg.slug}". Add review count.`,
      );
    }
  }
  return pkgs;
}

// ---------------------------------------------------------------------------
// Package catalogue
// ---------------------------------------------------------------------------

/**
 * ⚠️  DATA PROVENANCE NOTICE
 *
 * These six records are DEMONSTRATION / STARTER DATA supplied during initial
 * build. Their prices, ratings, review counts, highlights, and night/day
 * values have NOT been confirmed by the Cheroot Holidays business owner.
 *
 * Before launch:
 *  • Replace dataStatus "demo" → "verified" only after client sign-off.
 *  • Replace or remove any price / rating / reviews values the client cannot
 *    confirm.
 *  • Replace SVG placeholder images with real WebP photographs.
 *
 * Image notes: current images are brand-palette SVG placeholders.
 * WebP candidates are in public/packages/imported/ — see
 * data/image-mappings.ts and reports/legacy-data-audit.md before assigning.
 */
const rawPackages: TravelPackage[] = [
  {
    slug: "dubai-deluxe-escape",
    title: "Dubai Deluxe Escape",
    destination: "Dubai",
    destinationSlug: "dubai",
    category: "international",
    nights: 5,
    days: 6,
    // ⚠️ Price not client-verified — confirm before launch.
    price: 64999,
    // ⚠️ Rating/reviews are demo values — confirm before launch.
    rating: 4.8,
    reviews: 126,
    badge: "Bestseller",
    highlights: ["Desert safari", "Burj Khalifa", "Dhow dinner cruise"],
    description:
      "Immerse yourself in Dubai's iconic contrasts — from glittering desert dunes to record-breaking skylines and world-class dining.",
    travelStyles: ["luxury", "family", "group"],
    image: "/packages/imported/2jfz2vj06sk.webp",
    gallery: [
      "/packages/imported/4neuzu-ynnw.webp",
      "/packages/imported/c3zbeazk64q.webp",
      "/packages/imported/ktivtunp-lw.webp",
    ],
    dataStatus: "demo",
  },
  {
    slug: "bali-serenity-honeymoon",
    title: "Bali Serenity Honeymoon",
    destination: "Bali",
    destinationSlug: "bali",
    category: "honeymoon",
    nights: 6,
    days: 7,
    price: 89999,
    rating: 4.9,
    reviews: 98,
    badge: "Honeymoon pick",
    highlights: ["Ubud rice terraces", "Private pool villa", "Uluwatu sunset"],
    description:
      "A curated Balinese escape — terraced rice fields, cliffside temples, and private villas designed for couples.",
    travelStyles: ["honeymoon", "couple", "luxury"],
    image: "/packages/bali-serenity-honeymoon.jpg",
    dataStatus: "demo",
  },
  {
    slug: "kashmir-snowline-journey",
    title: "Kashmir Snowline Journey",
    destination: "Kashmir",
    destinationSlug: "kashmir",
    category: "domestic",
    nights: 5,
    days: 6,
    price: 42999,
    rating: 4.7,
    reviews: 154,
    highlights: ["Gondola ride", "Shikara on Dal Lake", "Pahalgam valley"],
    description:
      "Drift across Dal Lake at dawn, ride Asia's highest gondola, and walk through meadows that inspired a thousand verses.",
    travelStyles: ["family", "adventure", "couple", "honeymoon"],
    image: "/packages/kashmir-snowline-journey.jpg",
    dataStatus: "demo",
  },
  {
    slug: "goa-coastal-getaway",
    title: "Goa Coastal Getaway",
    destination: "Goa",
    destinationSlug: "goa",
    category: "domestic",
    nights: 3,
    days: 4,
    price: 24999,
    rating: 4.6,
    reviews: 210,
    badge: "Weekend pick",
    highlights: ["North Goa beaches", "Fort Aguada", "Sunset cruise"],
    description:
      "Sun-soaked beaches, colonial forts, and laid-back evenings — Goa compressed into a perfectly paced long weekend.",
    travelStyles: ["backpacker", "adventure", "family", "group"],
    image: "/packages/goa-coastal-getaway.jpg",
    dataStatus: "demo",
  },
  {
    slug: "maldives-overwater-retreat",
    title: "Maldives Overwater Retreat",
    destination: "Maldives",
    destinationSlug: "maldives",
    category: "honeymoon",
    nights: 4,
    days: 5,
    price: 124999,
    rating: 4.9,
    reviews: 61,
    highlights: ["Overwater villa", "Candlelight dinner", "Snorkelling"],
    description:
      "Wake above turquoise shallows, snorkel coral gardens, and dine under a canopy of stars in total seclusion.",
    travelStyles: ["honeymoon", "couple", "luxury"],
    image: "/packages/imported/e9g1rz-0rlu.webp",
    dataStatus: "demo",
  },
  {
    slug: "kerala-backwaters-trail",
    title: "Kerala Backwaters Trail",
    destination: "Kerala",
    destinationSlug: "kerala",
    category: "domestic",
    nights: 5,
    days: 6,
    price: 38999,
    rating: 4.7,
    reviews: 132,
    highlights: ["Houseboat night", "Munnar tea hills", "Alleppey canals"],
    description:
      "Glide through emerald backwaters on a traditional houseboat, trek misty tea estates, and unwind in God's Own Country.",
    travelStyles: ["family", "couple", "honeymoon"],
    image: "/packages/imported/water-boat-kerala-870x555-1.webp",
    gallery: [
      "/packages/imported/munnar-hillstation-kerala.webp",
      "/packages/imported/29ezcwtmtnm.webp",
      "/packages/imported/jqc2noh3u3y.webp",
    ],
    dataStatus: "demo",
  },
];

// Run validation and export
export const packages: TravelPackage[] = validatePackages(rawPackages);

/**
 * Featured packages shown on the home page.
 * Returns first 4 records. Update this selector once real data is available.
 */
export const featuredPackages = packages.slice(0, 4);

/**
 * Deterministic curated list of package slugs for the hero carousel.
 * Order here defines the slide sequence in the hero carousel.
 * Up to five real packages are selected.
 */
export const HERO_FEATURED_SLUGS: string[] = [
  "dubai-deluxe-escape",
  "bali-serenity-honeymoon",
  "kashmir-snowline-journey",
  "maldives-overwater-retreat",
  "kerala-backwaters-trail",
];

/**
 * Selects up to `limit` (default 5) featured packages for the hero carousel.
 * Strictly uses genuine packages from the canonical dataset without duplication.
 */
export function getHeroFeaturedPackages(limit = 5): TravelPackage[] {
  const selected: TravelPackage[] = [];
  const seen = new Set<string>();

  for (const slug of HERO_FEATURED_SLUGS) {
    const pkg = packages.find((p) => p.slug === slug);
    if (pkg && !seen.has(pkg.slug)) {
      selected.push(pkg);
      seen.add(pkg.slug);
      if (selected.length >= limit) return selected;
    }
  }

  for (const pkg of packages) {
    if (!seen.has(pkg.slug)) {
      selected.push(pkg);
      seen.add(pkg.slug);
      if (selected.length >= limit) break;
    }
  }

  return selected;
}

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

/** Returns packages matching a given category. */
export function getPackagesByCategory(
  category: DestinationCategory,
): TravelPackage[] {
  return packages.filter((p) => p.category === category);
}

/** Returns packages matching a destination slug. */
export function getPackagesByDestination(
  destinationSlug: string,
): TravelPackage[] {
  return packages.filter((p) => p.destinationSlug === destinationSlug);
}

/**
 * Returns the minimum verified price across all packages for a destination.
 * Returns undefined if no package has a confirmed price.
 */
export function getMinPriceForDestination(
  destinationSlug: string,
): number | undefined {
  const prices = getPackagesByDestination(destinationSlug)
    .map((p) => p.price)
    .filter((p): p is number => typeof p === "number" && p > 0);
  return prices.length > 0 ? Math.min(...prices) : undefined;
}

/**
 * Returns the real package count for a destination from the actual data.
 * Use this instead of hardcoded destination.packageCount.
 */
export function getPackageCountForDestination(destinationSlug: string): number {
  return getPackagesByDestination(destinationSlug).length;
}

/** Unique destination slugs present in the package catalogue. */
export const packageDestinationSlugs = [
  ...new Set(packages.map((p) => p.destinationSlug)),
];

/** Unique categories present in the package catalogue. */
export const packageCategories = [
  ...new Set(packages.map((p) => p.category)),
] as DestinationCategory[];
