/**
 * Distance Calculation & Formatting
 *
 * Geographical distance calculations using the Haversine formula on WGS-84 coordinates.
 * Explicitly distinguishes straight-line distance from driving or transit distances.
 */

export { haversineKm } from "./haversine";

/**
 * Formats a distance in kilometres with explicit straight-line indicator.
 * Returns null if distance is not available.
 * Never fabricates or estimates distances without valid coordinates.
 */
export function formatDistanceKm(distanceKm: number | null | undefined): string | null {
  if (distanceKm === null || distanceKm === undefined || !Number.isFinite(distanceKm)) {
    return null;
  }
  const rounded = Math.round(distanceKm);
  const formatted = rounded.toLocaleString("en-IN");
  return `~${formatted} km (approx. straight-line)`;
}
