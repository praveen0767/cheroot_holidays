/**
 * COMPASS ATLAS — Navigation Data Layer
 *
 * Single source of truth for the mega-menu system.
 * Derives package and destination data from canonical datasets.
 * Do NOT duplicate slugs, prices or destination names here.
 */

import { packages, getPackagesByCategory } from "@/data/packages";
import { destinations } from "@/data/destinations";
import { services } from "@/data/services";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NavCategory = {
  key: string;
  label: string;
  description: string;
  href: string;
};

export type NavDestinationGroup = {
  region: string;
  /** ISO region code used for the compass-atlas label */
  code: string;
  destinations: Array<{
    name: string;
    slug: string;
    href: string;
    hasPackage: boolean;
  }>;
};

export type NavPackageItem = {
  slug: string;
  title: string;
  destination: string;
  nights?: number;
  days?: number;
  price?: number;
  image: string;
  href: string;
};

export type NavServiceGroup = {
  group: string;
  items: Array<{
    slug: string;
    title: string;
    short: string;
    href: string;
  }>;
};

export type NavFeaturedCard = {
  image: string;
  destination: string;
  tagline: string;
  packageTitle?: string;
  href: string;
  ctaLabel: string;
};

// ---------------------------------------------------------------------------
// Journey categories
// ---------------------------------------------------------------------------

export const JOURNEY_CATEGORIES: NavCategory[] = [
  {
    key: "international",
    label: "International Journeys",
    description: "Asia, Middle East, Europe & beyond",
    href: "/packages?category=international",
  },
  {
    key: "domestic",
    label: "India Journeys",
    description: "Himalayas, backwaters, deserts & coasts",
    href: "/packages?category=domestic",
  },
  {
    key: "honeymoon",
    label: "Honeymoon Escapes",
    description: "Curated romance itineraries",
    href: "/packages?category=honeymoon",
  },
  {
    key: "custom",
    label: "Custom Trip Planning",
    description: "Tell us where — we'll plan the rest",
    href: "/contact?interest=custom-trip",
  },
];

// ---------------------------------------------------------------------------
// Destination groups (Compass Atlas index)
// ---------------------------------------------------------------------------

/** Manually audited region mapping keyed by destination slug */
const DESTINATION_REGION_MAP: Record<string, string> = {
  dubai: "Middle East",
  maldives: "Islands",
  bali: "Asia",
  goa: "India",
  kashmir: "India",
  kerala: "India",
};

function getRegionCode(region: string): string {
  const codes: Record<string, string> = {
    "Middle East": "ME",
    Islands: "IS",
    Asia: "AS",
    India: "IN",
    Europe: "EU",
    Africa: "AF",
  };
  return codes[region] ?? region.slice(0, 2).toUpperCase();
}

/** Derive destination navigation groups from canonical data */
export function getDestinationGroups(): NavDestinationGroup[] {
  const packageSlugs = new Set(packages.map((p) => p.destinationSlug));

  // Group destinations by region
  const byRegion: Record<string, NavDestinationGroup> = {};

  for (const dest of destinations) {
    const region = DESTINATION_REGION_MAP[dest.slug] ?? "Other";
    if (!byRegion[region]) {
      byRegion[region] = {
        region,
        code: getRegionCode(region),
        destinations: [],
      };
    }
    byRegion[region].destinations.push({
      name: dest.name,
      slug: dest.slug,
      href: `/destinations/${dest.slug}`,
      hasPackage: packageSlugs.has(dest.slug),
    });
  }

  // Sort: India first, then alphabetical
  const order = ["India", "Islands", "Middle East", "Asia", "Europe", "Africa", "Other"];
  return Object.values(byRegion).sort(
    (a, b) => (order.indexOf(a.region) ?? 99) - (order.indexOf(b.region) ?? 99),
  );
}

// ---------------------------------------------------------------------------
// Package navigation items
// ---------------------------------------------------------------------------

/** Returns up to `limit` nav-ready package items for a given category */
export function getPackageNavItems(
  category: "international" | "domestic" | "honeymoon",
  limit = 4,
): NavPackageItem[] {
  return getPackagesByCategory(category)
    .slice(0, limit)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      destination: p.destination,
      nights: p.nights,
      days: p.days,
      price: p.price,
      image: p.image,
      href: `/packages/${p.slug}`,
    }));
}

// ---------------------------------------------------------------------------
// Honeymoon destination groups
// ---------------------------------------------------------------------------

export function getHoneymoonDestinationGroups(): NavDestinationGroup[] {
  const honeymoonDests = destinations.filter(
    (d) => d.category === "honeymoon" || d.slug === "bali" || d.slug === "maldives",
  );

  // Domestic honeymoon candidates from domestic category
  const domesticHoneymoon = destinations.filter(
    (d) => d.category === "domestic" && (d.slug === "goa" || d.slug === "kashmir" || d.slug === "kerala"),
  );

  const groups: NavDestinationGroup[] = [];

  if (domesticHoneymoon.length > 0) {
    groups.push({
      region: "Within India",
      code: "IN",
      destinations: domesticHoneymoon.map((d) => ({
        name: d.name,
        slug: d.slug,
        href: `/destinations/${d.slug}`,
        hasPackage: packages.some((p) => p.destinationSlug === d.slug),
      })),
    });
  }

  const islands = honeymoonDests.filter((d) => d.slug === "maldives" || d.slug === "bali");
  if (islands.length > 0) {
    groups.push({
      region: "Islands & Coastal",
      code: "IS",
      destinations: islands.map((d) => ({
        name: d.name,
        slug: d.slug,
        href: `/destinations/${d.slug}`,
        hasPackage: packages.some((p) => p.destinationSlug === d.slug),
      })),
    });
  }

  return groups;
}

// ---------------------------------------------------------------------------
// Service navigation groups
// ---------------------------------------------------------------------------

export function getServiceNavGroups(): NavServiceGroup[] {
  const groups: Record<string, NavServiceGroup> = {
    Plan: { group: "Plan", items: [] },
    Book: { group: "Book", items: [] },
    Prepare: { group: "Prepare", items: [] },
  };

  for (const service of services) {
    const item = {
      slug: service.slug,
      title: service.title,
      short: service.short,
      href: `/services#${service.slug}`,
    };
    if (service.slug === "custom-itineraries" || service.slug === "travel-support") {
      groups.Plan.items.push(item);
    } else if (service.slug === "flight-booking" || service.slug === "hotel-booking") {
      groups.Book.items.push(item);
    } else {
      groups.Prepare.items.push(item);
    }
  }

  return Object.values(groups).filter((g) => g.items.length > 0);
}

// ---------------------------------------------------------------------------
// Featured cards
// ---------------------------------------------------------------------------

export function getDestinationsFeaturedCard(): NavFeaturedCard {
  // Use the Bali destination — it has a nice beach image
  const bali = destinations.find((d) => d.slug === "bali");
  const baliPkg = packages.find((p) => p.destinationSlug === "bali");
  return {
    image: bali?.image ?? "/packages/bali-serenity-honeymoon.jpg",
    destination: "Bali, Indonesia",
    tagline: "Rice terraces, clifftop temples and ocean air",
    packageTitle: baliPkg?.title,
    href: baliPkg ? `/packages/${baliPkg.slug}` : "/destinations/bali",
    ctaLabel: baliPkg ? "View Package" : "Explore Bali",
  };
}

export function getPackagesFeaturedCard(
  category: "international" | "domestic" | "honeymoon",
): NavFeaturedCard {
  const cat = getPackagesByCategory(category);
  const featured = cat[0];
  if (!featured) {
    return {
      image: "/brand/placeholder-package.svg",
      destination: "Build your own journey",
      tagline: "Tell us where you want to go — we'll handle every detail",
      href: "/contact?interest=custom-trip",
      ctaLabel: "Plan a Custom Trip",
    };
  }
  return {
    image: featured.image,
    destination: featured.destination,
    tagline: featured.description ?? featured.title,
    packageTitle: featured.title,
    href: `/packages/${featured.slug}`,
    ctaLabel: "View Package",
  };
}

export function getHoneymoonFeaturedCard(): NavFeaturedCard {
  const honeymoonPkgs = getPackagesByCategory("honeymoon");
  const maldives = honeymoonPkgs.find((p) => p.destinationSlug === "maldives");
  const featured = maldives ?? honeymoonPkgs[0];
  return {
    image: featured?.image ?? "/packages/imported/e9g1rz-0rlu.webp",
    destination: featured?.destination ?? "Maldives",
    tagline: "Overwater calm, turquoise horizons and complete seclusion",
    packageTitle: featured?.title,
    href: featured ? `/packages/${featured.slug}` : "/contact?interest=honeymoon",
    ctaLabel: featured ? "View Package" : "Plan a Honeymoon",
  };
}
