/**
 * Place-Aware Package & Destination Recommendation Service
 *
 * Orchestrates:
 * 1. Exact and relevant package matching against canonical catalogue.
 * 2. Coordinate-aware nearest-destination suggestions via Haversine.
 * 3. Graceful fallback to custom itinerary planning when no ready-made package exists (e.g. Delhi).
 * 4. Strictly honest data — never fabricates distances, packages, or availability.
 */

import { packages } from "@/data/packages";
import type { PlaceRecord } from "@/lib/places/types";
import { rankPackages } from "./rank";
import { getRecommendationsForPlace } from "./nearestDestinations";
import type { RecommendationResult, PackageRecommendation, NearbyDestination } from "./types";

export type GetRecommendationsOptions = {
  destinationPlace?: PlaceRecord | null;
  destinationText?: string;
  originPlace?: PlaceRecord | null;
  travelStyle?: string;
  limit?: number;
};

export function getRecommendations(options: GetRecommendationsOptions): RecommendationResult {
  const {
    destinationPlace,
    destinationText = "",
    originPlace,
    travelStyle,
    limit = 6,
  } = options;

  const searchQuery = destinationText.trim() || destinationPlace?.name || "";

  // 1. Find ranked packages matching the destination query / place / travel style
  const ranked = rankPackages(packages, {
    destinationQuery: searchQuery,
    destinationPlace,
    travelStyle,
  });

  const exactRecommendations: PackageRecommendation[] = [];
  const nearbyRecommendations: PackageRecommendation[] = [];

  for (const item of ranked) {
    const rec: PackageRecommendation = {
      pkg: item.pkg,
      matchType: item.matchType,
      reason: item.reason,
    };

    if (item.matchType === "exact_destination" || item.matchType === "exact_title") {
      exactRecommendations.push(rec);
    } else {
      nearbyRecommendations.push(rec);
    }
  }

  // 2. Determine if coordinate-aware nearby destinations should be calculated
  const referencePlace = destinationPlace || originPlace;
  let coordinatesUsed = false;
  let nearbyDestinations: NearbyDestination[] = [];

  if (referencePlace) {
    nearbyDestinations = getRecommendationsForPlace(referencePlace, 4);
    coordinatesUsed = referencePlace.latitude !== undefined && referencePlace.longitude !== undefined;
  }

  // 3. Delhi acceptance test requirement:
  // If no exact ready-made package exists, show custom planning option
  const showCustomPlanningOption = exactRecommendations.length === 0;

  return {
    exactMatches: exactRecommendations.slice(0, limit),
    nearbyMatches: nearbyRecommendations.slice(0, limit),
    showCustomPlanningOption,
    searchedPlace: searchQuery,
    coordinatesUsed,
    nearbyDestinations,
  };
}

export type { RecommendationResult, PackageRecommendation, NearbyDestination };
