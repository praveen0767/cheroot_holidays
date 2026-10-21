/**
 * Deterministic Place Search Service
 *
 * Implements typed, deterministic scoring and ranking over place records.
 */

import type { PlaceRecord, PlaceSearchOptions, PlaceSearchResult } from "./types";
import { normalizePlaceText, tokenizePlaceText } from "./normalize";
import placesData from "@/data/places/india-places.json";

// Cast loaded JSON data to PlaceRecord[]
const ALL_PLACES: PlaceRecord[] = placesData as PlaceRecord[];

type ScoredPlace = {
  place: PlaceRecord;
  score: number;
};

/**
 * Calculates deterministic match score for a place given normalized query and tokens.
 */
function calculateScore(place: PlaceRecord, queryNorm: string, queryTokens: string[]): number {
  const nameNorm = normalizePlaceText(place.name);
  const displayNorm = normalizePlaceText(place.displayName);
  const aliasesNorm = place.aliases.map(normalizePlaceText);
  const stateNorm = place.state ? normalizePlaceText(place.state) : "";
  const cityNorm = place.city ? normalizePlaceText(place.city) : "";

  // Tamil fields if available
  const nameTamilNorm = place.nameTamil ? normalizePlaceText(place.nameTamil) : "";
  const displayTamilNorm = place.displayNameTamil ? normalizePlaceText(place.displayNameTamil) : "";
  const aliasesTamilNorm = (place.aliasesTamil || []).map(normalizePlaceText);

  // 1. Exact match on primary name or Tamil name (highest priority)
  if (nameNorm === queryNorm || (nameTamilNorm && nameTamilNorm === queryNorm)) return 100;
  if (displayNorm === queryNorm || (displayTamilNorm && displayTamilNorm === queryNorm)) return 98;

  // 2. Exact match on an alias (e.g. "bangalore" -> Bengaluru, "bombay" -> Mumbai, or Tamil aliases)
  if (aliasesNorm.some((a) => a === queryNorm) || aliasesTamilNorm.some((a) => a === queryNorm)) return 90;

  // 3. Name starts with query (prefix match)
  if (nameNorm.startsWith(queryNorm) || (nameTamilNorm && nameTamilNorm.startsWith(queryNorm))) return 85;

  // 4. Any alias starts with query
  if (aliasesNorm.some((a) => a.startsWith(queryNorm)) || aliasesTamilNorm.some((a) => a.startsWith(queryNorm))) return 75;

  // 5. Display name starts with query
  if (displayNorm.startsWith(queryNorm) || (displayTamilNorm && displayTamilNorm.startsWith(queryNorm))) return 70;

  // 6. City or State starts with query
  if (cityNorm && cityNorm.startsWith(queryNorm)) return 65;
  if (stateNorm && stateNorm.startsWith(queryNorm)) return 60;

  // 7. Multi-token match: all query tokens appear in name/display/aliases/keywords/tamil
  if (queryTokens.length > 1) {
    const combinedTokens = [
      ...tokenizePlaceText(place.name),
      ...tokenizePlaceText(place.displayName),
      ...place.aliases.flatMap(tokenizePlaceText),
      ...place.searchKeywords.map(normalizePlaceText),
      ...(place.nameTamil ? tokenizePlaceText(place.nameTamil) : []),
      ...(place.displayNameTamil ? tokenizePlaceText(place.displayNameTamil) : []),
      ...(place.aliasesTamil ? place.aliasesTamil.flatMap(tokenizePlaceText) : []),
    ];
    const allTokensMatched = queryTokens.every((qTok) =>
      combinedTokens.some((cTok) => cTok.startsWith(qTok)),
    );
    if (allTokensMatched) return 55;
  }

  // 8. Name contains query as a substring
  if (nameNorm.includes(queryNorm) || (nameTamilNorm && nameTamilNorm.includes(queryNorm))) return 45;
  if (displayNorm.includes(queryNorm) || (displayTamilNorm && displayTamilNorm.includes(queryNorm))) return 40;

  // 9. Alias contains query as a substring
  if (aliasesNorm.some((a) => a.includes(queryNorm)) || aliasesTamilNorm.some((a) => a.includes(queryNorm))) return 35;

  // 10. Keyword match
  const keywordMatches = place.searchKeywords.some((k) =>
    normalizePlaceText(k).includes(queryNorm),
  );
  if (keywordMatches) return 25;

  return 0;
}

/**
 * Searches places deterministically using local curated registry.
 */
export function searchLocalPlaces(
  query: string,
  options: PlaceSearchOptions = {},
): PlaceSearchResult {
  const queryNorm = normalizePlaceText(query);
  const queryTokens = tokenizePlaceText(query);
  const limit = options.limit ?? 6;
  const countryCode = options.countryCode?.toUpperCase();
  const isTamil = options.locale === "ta";

  const localizePlace = (p: PlaceRecord): PlaceRecord => {
    if (isTamil && p.nameTamil) {
      return {
        ...p,
        name: p.nameTamil,
        displayName: p.displayNameTamil || `${p.nameTamil}, ${p.country === "India" ? "இந்தியா" : p.country}`,
      };
    }
    return p;
  };

  // If query is empty, return popular destinations
  if (!queryNorm) {
    let pool = ALL_PLACES;
    if (countryCode) {
      pool = pool.filter((p) => p.countryCode === countryCode);
    }
    const popular = pool
      .filter((p) => p.popularDestination)
      .slice(0, limit)
      .map(localizePlace);
    return {
      items: popular,
      total: popular.length,
      source: "local",
      query: "",
    };
  }

  // Score all candidate places
  const scored: ScoredPlace[] = [];

  for (const place of ALL_PLACES) {
    if (countryCode && place.countryCode !== countryCode) {
      continue;
    }

    const score = calculateScore(place, queryNorm, queryTokens);
    if (score > 0) {
      scored.push({ place, score });
    }
  }

  // Deterministic sort:
  // 1. Score descending
  // 2. Popularity (popularDestination first)
  // 3. Alphabetical displayName ascending (tie-breaker)
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (Boolean(b.place.popularDestination) !== Boolean(a.place.popularDestination)) {
      return b.place.popularDestination ? 1 : -1;
    }
    return a.place.displayName.localeCompare(b.place.displayName);
  });

  const items = scored.slice(0, limit).map((s) => localizePlace(s.place));

  return {
    items,
    total: scored.length,
    source: "local",
    query,
    unresolvedQuery: items.length === 0 ? query : undefined,
  };
}

/**
 * Creates an unresolved custom place record for user-typed locations
 * not present in the registry, ensuring trip exploration never dead-ends.
 */
export function createUnresolvedPlace(customText: string, locale?: "en" | "ta"): PlaceRecord {
  const cleaned = customText.trim();
  const slug = normalizePlaceText(cleaned).replace(/\s+/g, "-") || "custom";
  const isTa = locale === "ta";
  return {
    id: `unresolved-${slug}`,
    name: cleaned,
    displayName: isTa ? `${cleaned} (தனிப்பயன் இடம்)` : `${cleaned} (Custom Location)`,
    placeType: "destination",
    country: isTa ? "இந்தியா" : "India",
    countryCode: "IN",
    aliases: [],
    searchKeywords: [cleaned.toLowerCase()],
    source: "unresolved_custom_text",
    verificationStatus: "unresolved_custom_text",
  };
}

/**
 * Finds a place record by ID.
 */
export function getLocalPlaceById(id: string): PlaceRecord | null {
  return ALL_PLACES.find((p) => p.id === id) ?? null;
}
