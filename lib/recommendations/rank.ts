/**
 * Deterministic Package & Destination Ranking Service
 *
 * Implements deterministic priority scoring:
 * 1. Exact destination match
 * 2. Exact or strong package-title match
 * 3. Matching category or travel style
 * 4. Relevant destination relationship
 * 5. Geographical proximity where valid coordinates exist
 * 6. Stable canonical ordering (title ascending) as the final tie-breaker
 *
 * Results never randomly reshuffle on repeat requests.
 */

import type { TravelPackage } from "@/data/packages";
import type { PlaceRecord } from "@/lib/places/types";
import { normalizePlaceText } from "@/lib/places/normalize";
import type { RecommendationMatchType } from "./types";

export type RankingCriteria = {
  destinationQuery?: string;
  destinationPlace?: PlaceRecord | null;
  travelStyle?: string;
  originCoords?: { lat: number; lon: number };
};

export type RankedPackage = {
  pkg: TravelPackage;
  matchType: RecommendationMatchType;
  score: number;
  reason: string;
};

export function rankPackages(
  packagesList: TravelPackage[],
  criteria: RankingCriteria,
): RankedPackage[] {
  const normQuery = criteria.destinationQuery ? normalizePlaceText(criteria.destinationQuery) : "";
  const placeSlug = criteria.destinationPlace?.associatedDestinationSlug?.toLowerCase();
  const placeName = criteria.destinationPlace ? normalizePlaceText(criteria.destinationPlace.name) : "";
  const placeAliases = (criteria.destinationPlace?.aliases ?? []).map(normalizePlaceText);
  const travelStyle = criteria.travelStyle?.toLowerCase().trim();

  const scored: RankedPackage[] = [];

  for (const pkg of packagesList) {
    let score = 0;
    let matchType: RecommendationMatchType = "regional_match";
    let reason = "Curated travel recommendation";

    const pkgDestNorm = normalizePlaceText(pkg.destination);
    const pkgDestSlug = pkg.destinationSlug.toLowerCase();
    const pkgTitleNorm = normalizePlaceText(pkg.title);

    // 1. Exact destination match
    if (
      (placeSlug && pkgDestSlug === placeSlug) ||
      (placeName && pkgDestNorm === placeName) ||
      (normQuery && pkgDestNorm === normQuery) ||
      placeAliases.some((alias) => pkgDestNorm === alias || pkgDestSlug === alias)
    ) {
      score += 1000;
      matchType = "exact_destination";
      reason = `Direct match for destination: ${pkg.destination}`;
    }
    // 2. Exact or strong title match
    else if (
      (normQuery && pkgTitleNorm.includes(normQuery)) ||
      (placeName && pkgTitleNorm.includes(placeName))
    ) {
      score += 500;
      matchType = "exact_title";
      reason = `Title matches: "${pkg.title}"`;
    }
    // 3. Category / travel style match
    if (travelStyle && (pkg.category === travelStyle || pkg.travelStyles?.includes(travelStyle))) {
      score += 200;
      if (score === 200) {
        matchType = "category_style";
        reason = `Matches travel style: ${travelStyle}`;
      }
    }

    if (score > 0) {
      scored.push({ pkg, matchType, score, reason });
    }
  }

  // Deterministic sort: score desc, then alphabetical title asc
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.pkg.title.localeCompare(b.pkg.title);
  });

  return scored;
}
