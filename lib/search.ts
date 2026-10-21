import type { TravelPackage } from "@/data/packages";
import { destinations, type Destination } from "@/data/destinations";

// ---------------------------------------------------------------------------
// Text normalization & tokenization
// ---------------------------------------------------------------------------

/**
 * Normalizes text for search comparison:
 * - Lowercases
 * - Strips diacritics/accents
 * - Replaces punctuation with spaces
 * - Trims and collapses multiple spaces
 */
export function normalizeSearchText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Breaks query string into clean tokens (minimum 1 char).
 */
export function tokenizeQuery(query: string): string[] {
  const norm = normalizeSearchText(query);
  if (!norm) return [];
  return norm.split(" ").filter(Boolean);
}

// ---------------------------------------------------------------------------
// Package search
// ---------------------------------------------------------------------------

export type PackageSearchItem = TravelPackage & {
  _score?: number;
};

/**
 * Country lookup cache from destinations dataset.
 */
const destinationCountryMap = new Map<string, string>();
for (const d of destinations) {
  destinationCountryMap.set(d.slug.toLowerCase(), d.country.toLowerCase());
  destinationCountryMap.set(d.name.toLowerCase(), d.country.toLowerCase());
}

/**
 * Searches travel packages using canonical data.
 * Supports:
 * - Multi-word queries (e.g., "bali honey" -> Bali Serenity Honeymoon)
 * - Partial words / prefix matching (e.g., "kerala backw" -> Kerala Backwaters)
 * - Titles, destinations, destination country, category, highlights, description
 * - Deterministic relevance scoring
 */
const GENERIC_INTENT_TERMS = new Set([
  "package",
  "packages",
  "tour",
  "tours",
  "holiday",
  "holidays",
  "trip",
  "trips",
  "travel",
  "journey",
  "journeys",
]);

/**
 * Searches travel packages using canonical data.
 * Supports:
 * - Multi-word queries (e.g., "bali honey" -> Bali Serenity Honeymoon)
 * - Partial words / prefix matching (e.g., "kerala backw" -> Kerala Backwaters)
 * - Category/Intent queries (e.g., "international packages", "domestic holidays")
 * - Titles, destinations, destination country, category, highlights, description
 * - Deterministic relevance scoring
 */
export function searchPackages(
  packagesList: TravelPackage[],
  query: string,
): TravelPackage[] {
  const allTokens = tokenizeQuery(query);
  if (allTokens.length === 0) return packagesList;

  // Separate specific search terms from generic intent words
  const specificTokens = allTokens.filter((t) => !GENERIC_INTENT_TERMS.has(t));
  // If the query is ONLY generic words (e.g. "packages" or "holiday tours"), match all packages
  const requiredTokens = specificTokens.length > 0 ? specificTokens : [];

  if (requiredTokens.length === 0) {
    return packagesList;
  }

  const scored: PackageSearchItem[] = [];

  for (const pkg of packagesList) {
    const titleNorm = normalizeSearchText(pkg.title);
    const destNorm = normalizeSearchText(pkg.destination);
    const catNorm = normalizeSearchText(pkg.category);
    const country = destinationCountryMap.get(pkg.destinationSlug.toLowerCase()) || "";
    const countryNorm = normalizeSearchText(country);
    const highlightsNorm = (pkg.highlights || []).map(normalizeSearchText).join(" ");
    const descNorm = normalizeSearchText(pkg.description || "");

    const titleWords = titleNorm.split(" ");
    const destWords = destNorm.split(" ");
    const countryWords = countryNorm.split(" ");
    const allWords = [
      ...titleWords,
      ...destWords,
      ...countryWords,
      ...catNorm.split(" "),
      ...highlightsNorm.split(" "),
      ...descNorm.split(" "),
    ].filter(Boolean);

    let matchesAllTokens = true;
    let score = 0;

    for (const token of requiredTokens) {
      let tokenMatched = false;

      // Exact match in title (highest value)
      if (titleNorm === token || titleWords.includes(token)) {
        score += 50;
        tokenMatched = true;
      } else if (titleWords.some((w) => w.startsWith(token))) {
        score += 35;
        tokenMatched = true;
      } else if (titleNorm.includes(token)) {
        score += 20;
        tokenMatched = true;
      }

      // Destination match
      if (destNorm === token || destWords.includes(token)) {
        score += 45;
        tokenMatched = true;
      } else if (destWords.some((w) => w.startsWith(token))) {
        score += 30;
        tokenMatched = true;
      } else if (destNorm.includes(token)) {
        score += 18;
        tokenMatched = true;
      }

      // Country match
      if (countryNorm && (countryNorm === token || countryWords.includes(token))) {
        score += 30;
        tokenMatched = true;
      } else if (countryWords.some((w) => w.startsWith(token))) {
        score += 20;
        tokenMatched = true;
      }

      // Category match (e.g. "international", "domestic", "honeymoon")
      if (catNorm === token || catNorm.startsWith(token)) {
        score += 35;
        tokenMatched = true;
      }

      // Highlights match (e.g. "backwaters", "safari", "burj khalifa", "snorkelling")
      if (highlightsNorm.includes(token)) {
        score += 25;
        tokenMatched = true;
      }

      // Description match
      if (descNorm.includes(token)) {
        score += 15;
        tokenMatched = true;
      }

      // Check any word prefix as fallback
      if (!tokenMatched && allWords.some((w) => w.startsWith(token))) {
        score += 10;
        tokenMatched = true;
      }

      if (!tokenMatched) {
        matchesAllTokens = false;
        break;
      }
    }

    if (matchesAllTokens && score > 0) {
      // Bonus if generic intent terms also match in title or description
      for (const t of allTokens) {
        if (GENERIC_INTENT_TERMS.has(t) && (titleNorm.includes(t) || descNorm.includes(t))) {
          score += 5;
        }
      }
      scored.push({ ...pkg, _score: score });
    }
  }

  // Sort by score descending, then title alphabetically
  scored.sort((a, b) => {
    const diff = (b._score ?? 0) - (a._score ?? 0);
    if (diff !== 0) return diff;
    return a.title.localeCompare(b.title);
  });

  return scored;
}

// ---------------------------------------------------------------------------
// Destination search
// ---------------------------------------------------------------------------

export function searchDestinations(
  destinationsList: Destination[],
  query: string,
): Destination[] {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return destinationsList;

  return destinationsList.filter((dest) => {
    const nameNorm = normalizeSearchText(dest.name);
    const countryNorm = normalizeSearchText(dest.country);
    const catNorm = normalizeSearchText(dest.category);
    const taglineNorm = normalizeSearchText(dest.tagline);

    const words = [
      ...nameNorm.split(" "),
      ...countryNorm.split(" "),
      ...catNorm.split(" "),
      ...taglineNorm.split(" "),
    ].filter(Boolean);

    return tokens.every((token) => {
      return (
        nameNorm.includes(token) ||
        countryNorm.includes(token) ||
        catNorm.includes(token) ||
        taglineNorm.includes(token) ||
        words.some((w) => w.startsWith(token))
      );
    });
  });
}

// ---------------------------------------------------------------------------
// Search suggestions
// ---------------------------------------------------------------------------

export type SearchSuggestion = {
  id: string;
  type: "package" | "destination" | "category";
  label: string;
  subtitle: string;
  href: string;
};

/**
 * Curated suggestions shown when input is focused before typing
 */
export const POPULAR_SEARCH_SUGGESTIONS: SearchSuggestion[] = [
  {
    id: "pop-dubai",
    type: "destination",
    label: "Dubai",
    subtitle: "United Arab Emirates · International",
    href: "/packages?q=dubai",
  },
  {
    id: "pop-bali",
    type: "package",
    label: "Bali Serenity Honeymoon",
    subtitle: "Bali · Honeymoon retreat",
    href: "/packages/bali-serenity-honeymoon",
  },
  {
    id: "pop-kerala",
    type: "package",
    label: "Kerala Backwaters Trail",
    subtitle: "Kerala · Houseboats & tea hills",
    href: "/packages/kerala-backwaters-trail",
  },
  {
    id: "pop-kashmir",
    type: "destination",
    label: "Kashmir",
    subtitle: "India · Snowline journeys & Dal Lake",
    href: "/packages?q=kashmir",
  },
  {
    id: "pop-maldives",
    type: "package",
    label: "Maldives Overwater Retreat",
    subtitle: "Maldives · Luxury overwater villas",
    href: "/packages/maldives-overwater-retreat",
  },
];

/**
 * Generates live suggestions matching user query across canonical packages and destinations.
 */
export function getSearchSuggestions(
  query: string,
  allPackages: TravelPackage[],
  allDestinations: Destination[],
  limit = 6,
): SearchSuggestion[] {
  const q = query.trim();
  if (!q) return POPULAR_SEARCH_SUGGESTIONS.slice(0, limit);

  const results: SearchSuggestion[] = [];

  // Match packages
  const matchingPkgs = searchPackages(allPackages, q);
  for (const pkg of matchingPkgs) {
    results.push({
      id: `pkg-${pkg.slug}`,
      type: "package",
      label: pkg.title,
      subtitle: `${pkg.destination} · ${pkg.category}`,
      href: `/packages/${pkg.slug}`,
    });
    if (results.length >= limit) return results;
  }

  // Match destinations
  const matchingDests = searchDestinations(allDestinations, q);
  for (const dest of matchingDests) {
    if (!results.some((r) => r.label.toLowerCase() === dest.name.toLowerCase())) {
      results.push({
        id: `dest-${dest.slug}`,
        type: "destination",
        label: dest.name,
        subtitle: `${dest.country} · ${dest.category}`,
        href: `/packages?destination=${dest.slug}`,
      });
    }
    if (results.length >= limit) return results;
  }

  return results;
}
