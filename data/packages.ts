import type { DestinationCategory } from "@/data/destinations";

export type TravelPackage = {
  slug: string;
  title: string;
  destination: string;
  destinationSlug: string;
  category: DestinationCategory;
  nights: number;
  days: number;
  price: number;
  rating: number;
  reviews: number;
  badge?: string;
  highlights: string[];
  image: string;
};

export const packages: TravelPackage[] = [
  {
    slug: "dubai-deluxe-escape",
    title: "Dubai Deluxe Escape",
    destination: "Dubai",
    destinationSlug: "dubai",
    category: "international",
    nights: 5,
    days: 6,
    price: 64999,
    rating: 4.8,
    reviews: 126,
    badge: "Bestseller",
    highlights: ["Desert safari", "Burj Khalifa", "Dhow dinner cruise"],
    image: "/packages/dubai-deluxe-escape.svg",
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
    image: "/packages/bali-serenity-honeymoon.svg",
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
    image: "/packages/kashmir-snowline-journey.svg",
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
    image: "/packages/goa-coastal-getaway.svg",
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
    image: "/packages/maldives-overwater-retreat.svg",
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
    image: "/packages/kerala-backwaters-trail.svg",
  },
];

export const featuredPackages = packages.slice(0, 4);
