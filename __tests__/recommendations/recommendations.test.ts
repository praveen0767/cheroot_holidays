/**
 * Recommendation Engine Tests
 */

import { describe, it, expect } from "vitest";
import { haversineKm } from "@/lib/recommendations/haversine";
import { getNearestDestinations, getRecommendationsForPlace } from "@/lib/recommendations/nearestDestinations";
import type { PlaceRecord } from "@/lib/places/types";

// ─── Haversine distance ───────────────────────────────────────────────────────

describe("haversineKm", () => {
  it("returns 0 for identical coordinates", () => {
    expect(haversineKm(12.9716, 77.5946, 12.9716, 77.5946)).toBe(0);
  });

  it("returns approximate distance between Chennai and Bengaluru", () => {
    // Chennai: 13.0827, 80.2707 | Bengaluru: 12.9716, 77.5946 — ~290km
    const dist = haversineKm(13.0827, 80.2707, 12.9716, 77.5946);
    expect(dist).toBeGreaterThan(250);
    expect(dist).toBeLessThan(350);
  });

  it("returns approximate distance between Delhi and Mumbai", () => {
    // Delhi: 28.6139, 77.2090 | Mumbai: 19.0760, 72.8777 — ~1155km
    const dist = haversineKm(28.6139, 77.209, 19.076, 72.8777);
    expect(dist).toBeGreaterThan(1000);
    expect(dist).toBeLessThan(1300);
  });

  it("is symmetric", () => {
    const ab = haversineKm(13.08, 80.27, 12.97, 77.59);
    const ba = haversineKm(12.97, 77.59, 13.08, 80.27);
    expect(Math.abs(ab - ba)).toBeLessThan(0.001);
  });

  it("returns a positive number for distinct coordinates", () => {
    expect(haversineKm(0, 0, 1, 1)).toBeGreaterThan(0);
  });
});

// ─── getNearestDestinations ───────────────────────────────────────────────────

describe("getNearestDestinations", () => {
  it("returns the requested limit", () => {
    const results = getNearestDestinations(13.0827, 80.2707, 3);
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it("sorts by distance ascending for coordinated destinations", () => {
    const results = getNearestDestinations(13.0827, 80.2707, 6);
    const withCoords = results.filter((r) => r.distanceKm !== null);
    for (let i = 1; i < withCoords.length; i++) {
      expect(withCoords[i].distanceKm!).toBeGreaterThanOrEqual(withCoords[i - 1].distanceKm!);
    }
  });

  it("places null-distance results at the end", () => {
    const results = getNearestDestinations(13.0827, 80.2707, 10);
    const nullIdx = results.findIndex((r) => r.distanceKm === null);
    const nonNullAfterNull = nullIdx > -1
      ? results.slice(nullIdx).some((r) => r.distanceKm !== null)
      : false;
    expect(nonNullAfterNull).toBe(false);
  });

  it("never fabricates distance values (no NaN or negative)", () => {
    const results = getNearestDestinations(28.6139, 77.209, 6);
    for (const r of results) {
      if (r.distanceKm !== null) {
        expect(isNaN(r.distanceKm)).toBe(false);
        expect(r.distanceKm).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

// ─── getRecommendationsForPlace ───────────────────────────────────────────────

describe("getRecommendationsForPlace", () => {
  const placeWithCoords: PlaceRecord = {
    id: "in-delhi",
    name: "Delhi",
    displayName: "Delhi, India",
    placeType: "metro",
    state: "Delhi",
    country: "India",
    countryCode: "IN",
    aliases: ["New Delhi", "Delhi NCR"],
    searchKeywords: ["delhi", "ncr", "capital"],
    source: "local_curated",
    verificationStatus: "verified",
    latitude: 28.6139,
    longitude: 77.209,
    popularDestination: true,
  };

  const placeWithoutCoords: PlaceRecord = {
    id: "in-custom",
    name: "Unknown Custom",
    displayName: "Unknown Custom, India",
    placeType: "destination",
    country: "India",
    countryCode: "IN",
    aliases: [],
    searchKeywords: [],
    source: "unresolved_custom_text",
    verificationStatus: "unresolved_custom_text",
  };

  it("returns distance-ranked results for a place with coordinates", () => {
    const results = getRecommendationsForPlace(placeWithCoords, 4);
    expect(results.length).toBeGreaterThan(0);
    const withCoords = results.filter((r) => r.distanceKm !== null);
    expect(withCoords.length).toBeGreaterThan(0);
  });

  it("returns results for a place without coordinates", () => {
    const results = getRecommendationsForPlace(placeWithoutCoords, 4);
    expect(results.length).toBeGreaterThan(0);
    // All distances should be null since origin has no coordinates
    expect(results.every((r) => r.distanceKm === null)).toBe(true);
  });

  it("does not crash when coordinates are missing", () => {
    expect(() => getRecommendationsForPlace(placeWithoutCoords, 4)).not.toThrow();
  });

  it("respects the limit", () => {
    const results = getRecommendationsForPlace(placeWithCoords, 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });
});

// ─── formatDistanceKm ─────────────────────────────────────────────────────────

import { formatDistanceKm } from "@/lib/recommendations/distance";

describe("formatDistanceKm", () => {
  it("formats positive numbers with straight-line label", () => {
    expect(formatDistanceKm(1250)).toBe("~1,250 km (approx. straight-line)");
  });

  it("returns null for null, undefined, or NaN", () => {
    expect(formatDistanceKm(null)).toBeNull();
    expect(formatDistanceKm(undefined)).toBeNull();
    expect(formatDistanceKm(NaN)).toBeNull();
  });
});

// ─── getRecommendations & Delhi Acceptance Test ─────────────────────────────

import { getRecommendations } from "@/lib/recommendations/getRecommendations";
import { getPlaceProvider } from "@/lib/places/providers";

describe("getRecommendations — Delhi Acceptance Test", () => {
  const delhiPlace: PlaceRecord = {
    id: "in-delhi-new",
    name: "New Delhi",
    displayName: "New Delhi, Delhi, India",
    placeType: "metro",
    state: "Delhi",
    country: "India",
    countryCode: "IN",
    aliases: ["Delhi", "Delhi NCR"],
    searchKeywords: ["delhi", "capital"],
    source: "local_curated",
    verificationStatus: "verified",
    latitude: 28.6139,
    longitude: 77.209,
    popularDestination: true,
  };

  it("handles Delhi search without crashing: shows custom planning when no exact package exists", () => {
    const result = getRecommendations({
      destinationPlace: delhiPlace,
      destinationText: "Delhi",
    });

    // Cheroot's current catalogue has 6 packages (Dubai, Bali, Kashmir, Goa, Maldives, Kerala).
    // No ready-made package exists for Delhi itself.
    expect(result.exactMatches.length).toBe(0);
    expect(result.showCustomPlanningOption).toBe(true);
    expect(result.searchedPlace).toBe("Delhi");
    expect(result.coordinatesUsed).toBe(true);
  });

  it("returns exact matches when searching for an existing package destination (e.g. Bali)", () => {
    const result = getRecommendations({
      destinationText: "Bali",
    });

    expect(result.exactMatches.length).toBeGreaterThan(0);
    expect(result.exactMatches.some((m) => m.pkg.destination === "Bali")).toBe(true);
    expect(result.showCustomPlanningOption).toBe(false);
  });

  it("filters or boosts packages matching the travel style", () => {
    const honeymoonRecs = getRecommendations({
      travelStyle: "honeymoon",
    });

    expect(honeymoonRecs.nearbyMatches.length).toBeGreaterThan(0);
    const styles = honeymoonRecs.nearbyMatches.flatMap((m) => m.pkg.travelStyles ?? [m.pkg.category]);
    expect(styles).toContain("honeymoon");
  });
});

// ─── Provider Boundary Fallback Test ─────────────────────────────────────────

describe("getPlaceProvider fallback", () => {
  it("returns an available provider without crashing even when PLACES_PROVIDER is remote", () => {
    const origEnv = process.env.PLACES_PROVIDER;
    try {
      process.env.PLACES_PROVIDER = "remote";
      const provider = getPlaceProvider();
      expect(provider).toBeDefined();
      expect(provider.isAvailable()).toBe(true);
      expect(provider.id).toBe("local"); // Safely fell back to local
    } finally {
      process.env.PLACES_PROVIDER = origEnv;
    }
  });
});
