/**
 * CHEROOT HOLIDAYS — India-First Place Directory Types
 *
 * Types for local geographical intelligence, place search,
 * and location-aware recommendations.
 */

export type PlaceType =
  | "city"
  | "metro"
  | "state"
  | "union_territory"
  | "district"
  | "neighbourhood"
  | "destination"
  | "hill_station"
  | "pilgrimage"
  | "heritage"
  | "international_destination";

export type VerificationStatus = "verified" | "curated" | "unresolved_custom_text";

export type PlaceRecord = {
  /** Stable unique identifier (e.g. "in-delhi", "in-bengaluru") */
  id: string;
  /** Primary name of the location */
  name: string;
  /** Full geographic display name (e.g. "New Delhi, Delhi, India") */
  displayName: string;
  /** Classification of the place */
  placeType: PlaceType;
  /** Parent city if applicable */
  city?: string;
  /** District if applicable */
  district?: string;
  /** State or Union Territory */
  state?: string;
  /** Country name (e.g. "India") */
  country: string;
  /** ISO 3166-1 alpha-2 country code (e.g. "IN") */
  countryCode: string;
  /** Recognized alternate spellings, historical names, and aliases */
  aliases: string[];
  /** Latitude in decimal degrees (WGS84) where verified */
  latitude?: number;
  /** Longitude in decimal degrees (WGS84) where verified */
  longitude?: number;
  /** Geographic region (e.g. "North", "South", "West", "East", "Northeast", "Central", "Islands", "International") */
  region?: string;
  /** Search keywords and landmarks associated with this place */
  searchKeywords: string[];
  /** Data provenance source */
  source: "local_curated" | "external_api" | "unresolved_custom_text";
  /** Verification status of the record */
  verificationStatus: VerificationStatus;
  /** Whether this is a high-frequency search destination */
  popularDestination?: boolean;
  /** Slugs of packages or destinations directly mapped in Cheroot's catalogue */
  associatedDestinationSlug?: string;
  /** Tamil primary name if available */
  nameTamil?: string;
  /** Tamil display name if available */
  displayNameTamil?: string;
  /** Tamil aliases and search keywords */
  aliasesTamil?: string[];
};

export type PlaceSearchResult = {
  items: PlaceRecord[];
  total: number;
  source: "local" | "remote";
  query: string;
  unresolvedQuery?: string;
};

export type PlaceSearchOptions = {
  countryCode?: string;
  limit?: number;
  includeInternational?: boolean;
  locale?: "en" | "ta";
};
