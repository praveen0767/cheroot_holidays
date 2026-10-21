/**
 * Nearest Destination Recommendation Engine
 *
 * Uses Haversine distance to rank catalogue destinations nearest to a
 * resolved user origin or destination. Coordinate-aware, deterministic.
 */

import { haversineKm } from "./haversine";
import type { PlaceRecord } from "@/lib/places/types";
import { destinations, type Destination } from "@/data/destinations";

export type NearbyDestinationResult = {
  destination: Destination;
  distanceKm: number | null;
};

/**
 * Destination coordinate map — curated lat/lon for each catalogue destination.
 * These are approximate centroid coordinates for ranking purposes.
 */
const DESTINATION_COORDS: Record<string, { lat: number; lon: number }> = {
  goa: { lat: 15.2993, lon: 74.124 },
  dubai: { lat: 25.2048, lon: 55.2708 },
  bali: { lat: -8.3405, lon: 115.092 },
  kashmir: { lat: 34.0837, lon: 74.7973 },
  maldives: { lat: 3.2028, lon: 73.2207 },
  kerala: { lat: 10.8505, lon: 76.2711 },
};

/**
 * Returns all destinations sorted by distance from given coordinates.
 * Destinations without coordinate data are sorted to the end.
 */
export function getNearestDestinations(
  fromLat: number,
  fromLon: number,
  limit = 4,
): NearbyDestinationResult[] {
  const results: NearbyDestinationResult[] = destinations.map((dest) => {
    const coords = DESTINATION_COORDS[dest.slug];
    const distanceKm = coords
      ? haversineKm(fromLat, fromLon, coords.lat, coords.lon)
      : null;
    return { destination: dest, distanceKm };
  });

  // Sort: coordinates-resolved (nearest first), then unresolved at end
  results.sort((a, b) => {
    if (a.distanceKm === null && b.distanceKm === null) return 0;
    if (a.distanceKm === null) return 1;
    if (b.distanceKm === null) return -1;
    return a.distanceKm - b.distanceKm;
  });

  return results.slice(0, limit);
}

/**
 * Gets the nearest destinations to a resolved PlaceRecord.
 * If the place has no coordinates, falls back to returning all destinations in default order.
 */
export function getRecommendationsForPlace(
  place: PlaceRecord,
  limit = 4,
): NearbyDestinationResult[] {
  if (place.latitude !== undefined && place.longitude !== undefined) {
    return getNearestDestinations(place.latitude, place.longitude, limit);
  }

  // No coordinates: return catalogue destinations in default order with null distance
  return destinations.slice(0, limit).map((destination) => ({
    destination,
    distanceKm: null,
  }));
}
