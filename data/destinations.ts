import {
  getPackageCountForDestination,
  getMinPriceForDestination,
} from "./packages";

export type DestinationCategory = "international" | "domestic" | "honeymoon";

export type Destination = {
  slug: string;
  name: string;
  country: string;
  category: DestinationCategory;
  tagline: string;
  /**
   * Package count derived from the canonical package data.
   */
  packageCount?: number;
  /**
   * Minimum starting price derived from canonical package data.
   * Undefined when no packages have a confirmed price.
   */
  fromPrice?: number;
  image: string;
};

/**
 * ⚠️ DATA PROVENANCE NOTICE
 *
 * Destination records below are initial curated destinations.
 * packageCount and fromPrice are dynamically derived from `data/packages.ts`
 * to ensure numbers never contradict the actual package catalogue.
 */
const rawDestinations: Omit<Destination, "packageCount" | "fromPrice">[] = [
  {
    slug: "goa",
    name: "Goa",
    country: "India",
    category: "domestic",
    tagline: "Beaches, old forts and slow coastal evenings",
    image: "/destinations/goa.jpg",
  },
  {
    slug: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    category: "international",
    tagline: "Skyscrapers, desert safaris and skyline nights",
    image: "/packages/imported/2jfz2vj06sk.webp",
  },
  {
    slug: "bali",
    name: "Bali",
    country: "Indonesia",
    category: "international",
    tagline: "Rice terraces, clifftop temples and ocean air",
    image: "/destinations/bali.jpg",
  },
  {
    slug: "kashmir",
    name: "Kashmir",
    country: "India",
    category: "domestic",
    tagline: "Snow valleys, shikaras and pine-lined trails",
    image: "/destinations/kashmir.jpg",
  },
  {
    slug: "maldives",
    name: "Maldives",
    country: "Maldives",
    category: "honeymoon",
    tagline: "Overwater calm and turquoise horizons",
    image: "/packages/imported/e9g1rz-0rlu.webp",
  },
  {
    slug: "kerala",
    name: "Kerala",
    country: "India",
    category: "domestic",
    tagline: "Backwaters, hills and slow spice-country days",
    image: "/packages/imported/water-boat-kerala-870x555-1.webp",
  },
];

export const destinations: Destination[] = rawDestinations.map((d) => ({
  ...d,
  packageCount: getPackageCountForDestination(d.slug),
  fromPrice: getMinPriceForDestination(d.slug),
}));

/** Home page order: Goa, Dubai, Bali, Kashmir (per home wireframe). */
export const trendingDestinations = [
  destinations[0],
  destinations[1],
  destinations[2],
  destinations[3],
];

