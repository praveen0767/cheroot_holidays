/**
 * Recommendation Engine Types
 *
 * Shared types for the location-aware package recommendation system.
 */

import type { TravelPackage } from "@/data/packages";
import type { Destination } from "@/data/destinations";

/** Distance-ranked destination with optional km value */
export type NearbyDestination = {
  destination: Destination;
  /** Approximate straight-line distance in kilometres. Null when coordinates unavailable. */
  distanceKm: number | null;
};

/** Classification of how a recommendation was matched */
export type RecommendationMatchType =
  | "exact_destination"      // Package destination exactly matches searched place
  | "exact_title"            // Package title contains the searched place name
  | "category_style"         // Package matches the selected travel style/category
  | "nearby_destination"     // Nearest destination by Haversine distance
  | "regional_match"         // Same state/region without exact coordinates
  | "custom_itinerary";      // No matching package — custom planning offer

/** A single recommendation result */
export type PackageRecommendation = {
  pkg: TravelPackage;
  matchType: RecommendationMatchType;
  /** Approximate distance in km — only when matchType is nearby_destination */
  distanceKm?: number;
  /** Human-readable rationale for this recommendation */
  reason: string;
};

/** Full recommendation response for a query */
export type RecommendationResult = {
  /** Direct package matches (exact destination / title) */
  exactMatches: PackageRecommendation[];
  /** Nearby destination suggestions */
  nearbyMatches: PackageRecommendation[];
  /** Whether a custom itinerary option should be shown */
  showCustomPlanningOption: boolean;
  /** Text used in the search */
  searchedPlace: string;
  /** True when Haversine distance was used */
  coordinatesUsed: boolean;
  /** Distance-ranked catalogue destinations when origin/destination has coordinates */
  nearbyDestinations?: NearbyDestination[];
};
