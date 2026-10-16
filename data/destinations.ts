export type DestinationCategory = "international" | "domestic" | "honeymoon";

export type Destination = {
  slug: string;
  name: string;
  country: string;
  category: DestinationCategory;
  tagline: string;
  packageCount: number;
  fromPrice: number;
  image: string;
};

export const destinations: Destination[] = [
  {
    slug: "goa",
    name: "Goa",
    country: "India",
    category: "domestic",
    tagline: "Beaches, old forts and slow coastal evenings",
    packageCount: 14,
    fromPrice: 18999,
    image: "/destinations/goa.svg",
  },
  {
    slug: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    category: "international",
    tagline: "Skyscrapers, desert safaris and skyline nights",
    packageCount: 11,
    fromPrice: 54999,
    image: "/destinations/dubai.svg",
  },
  {
    slug: "bali",
    name: "Bali",
    country: "Indonesia",
    category: "international",
    tagline: "Rice terraces, clifftop temples and ocean air",
    packageCount: 9,
    fromPrice: 62999,
    image: "/destinations/bali.svg",
  },
  {
    slug: "kashmir",
    name: "Kashmir",
    country: "India",
    category: "domestic",
    tagline: "Snow valleys, shikaras and pine-lined trails",
    packageCount: 8,
    fromPrice: 34999,
    image: "/destinations/kashmir.svg",
  },
  {
    slug: "maldives",
    name: "Maldives",
    country: "Maldives",
    category: "honeymoon",
    tagline: "Overwater calm and turquoise horizons",
    packageCount: 6,
    fromPrice: 98999,
    image: "/destinations/maldives.svg",
  },
  {
    slug: "kerala",
    name: "Kerala",
    country: "India",
    category: "domestic",
    tagline: "Backwaters, hills and slow spice-country days",
    packageCount: 12,
    fromPrice: 27999,
    image: "/destinations/kerala.svg",
  },
];

/** Home page order: Goa, Dubai, Bali, Kashmir (per home wireframe). */
export const trendingDestinations = [
  destinations[0],
  destinations[1],
  destinations[2],
  destinations[3],
];
