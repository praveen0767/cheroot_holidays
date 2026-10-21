import fs from "node:fs";

const raw = JSON.parse(
  fs.readFileSync("data/legacy-package-image-candidates.json", "utf8")
);

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function inferCategory(dest) {
  const d = dest.toLowerCase();
  if (d.includes("honeymoon")) return "honeymoon";
  if (
    d.includes("kerala") ||
    d.includes("munnar") ||
    d.includes("wayanad") ||
    d.includes("jodhpur") ||
    d.includes("agra") ||
    d.includes("kedarnath") ||
    d.includes("jaipur") ||
    d.includes("coimbatore") ||
    d.includes("india")
  ) {
    return "domestic";
  }
  return "international";
}

function getCountryOrRegion(dest) {
  if (dest.includes("Thailand")) return "Thailand";
  if (dest.includes("Kerala") || dest.includes("India")) return "India";
  if (dest.includes("Dubai") || dest.includes("UAE")) return "United Arab Emirates";
  if (dest.includes("Japan")) return "Japan";
  if (dest.includes("South Korea") || dest.includes("Korea")) return "South Korea";
  if (dest.includes("Maldives")) return "Maldives";
  if (dest.includes("Egypt")) return "Egypt";
  if (dest.includes("Russia")) return "Russia";
  if (dest.includes("Cambodia")) return "Cambodia";
  if (
    dest.includes("USA") ||
    dest.includes("San Francisco") ||
    dest.includes("Los Angeles") ||
    dest.includes("New York")
  )
    return "United States";
  if (dest.includes("China") || dest.includes("Beijing") || dest.includes("Xi'an"))
    return "China";
  if (dest.includes("Niagara")) return "USA / Canada";
  if (dest.includes("Morocco")) return "Morocco";
  if (dest.includes("Peru")) return "Peru";
  return "Worldwide";
}

const items = raw.candidates.map((c) => {
  const isUsable = c.width >= 400 && c.height >= 300;
  const category = inferCategory(c.suggestedDestination);
  const country = getCountryOrRegion(c.suggestedDestination);
  const slug = `explore-${slugify(c.suggestedDestination)}-${c.imageId.toLowerCase()}`;
  const destSlug = slugify(country);
  return {
    id: c.imageId,
    slug,
    title: `Plan your trip to ${c.suggestedDestination}`,
    destination: c.suggestedDestination,
    destinationSlug: destSlug,
    countryOrRegion: country,
    category,
    image: c.image,
    originalFilename: c.originalFilename,
    width: c.width,
    height: c.height,
    confidence: c.confidence,
    basis: c.basis,
    isUsable,
    description: `Personalised itinerary and tailored quotation crafted on request. Share your preferred travel dates and group preferences with our travel specialists.`,
    enquiryUrl: `/contact?destination=${encodeURIComponent(c.suggestedDestination)}`,
  };
});

const tsCode = `import type { DestinationCategory } from "./destinations";

export type DestinationCandidate = {
  id: string;
  slug: string;
  title: string;
  destination: string;
  destinationSlug: string;
  countryOrRegion: string;
  category: DestinationCategory;
  image: string;
  originalFilename: string;
  width: number;
  height: number;
  confidence: "high" | "medium" | "low";
  basis: string;
  isUsable: boolean;
  description: string;
  enquiryUrl: string;
};

/**
 * ⚠️ DATA PROVENANCE NOTICE
 *
 * Recovered destination & travel photo candidates derived from legacy media.
 * These are unverified image candidates — NOT fixed-price packages.
 * They represent destinations where Cheroot Holidays crafts custom itineraries.
 */
export const destinationCandidates: DestinationCandidate[] = ${JSON.stringify(
  items,
  null,
  2
)};

/**
 * Usable destination candidates (excludes 4 thumbnail-only crops <400px).
 * Total: 37 high-resolution travel photographs.
 */
export const usableDestinationCandidates = destinationCandidates.filter((c) => c.isUsable);

/** Lookup helper by slug */
export function getCandidateBySlug(slug: string): DestinationCandidate | undefined {
  return destinationCandidates.find((c) => c.slug === slug);
}

/** Lookup helper by ID */
export function getCandidateById(id: string): DestinationCandidate | undefined {
  return destinationCandidates.find((c) => c.id === id);
}

/** Category filter helper */
export function getCandidatesByCategory(category: DestinationCategory | "all"): DestinationCandidate[] {
  if (category === "all") return usableDestinationCandidates;
  return usableDestinationCandidates.filter((c) => c.category === category);
}
`;

fs.writeFileSync("data/destination-candidates.ts", tsCode, "utf8");
console.log("Successfully generated data/destination-candidates.ts");
console.log(
  "Total candidates:",
  items.length,
  "Usable:",
  items.filter((i) => i.isUsable).length
);
