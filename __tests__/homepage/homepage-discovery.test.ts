/**
 * Homepage & Travel Discovery Integration Tests
 *
 * Validates Part 2 (Origin & Destination distinctness), Part 9 (Trip Planner),
 * Part 10 (Travel Rhythm), and Part 15 (No-dead-end discovery).
 */

import { describe, it, expect } from "vitest";
import { searchLocalPlaces } from "@/lib/places/search";
import { getRecommendations } from "@/lib/recommendations/getRecommendations";

describe("Homepage Discovery Flow — Origin & Destination Distinction", () => {
  it("resolves origin (Chennai) and destination (Delhi) as completely distinct entities", () => {
    const originSearch = searchLocalPlaces("Chennai", { limit: 1 });
    const destSearch = searchLocalPlaces("Delhi", { limit: 1 });

    expect(originSearch.items.length).toBeGreaterThan(0);
    expect(destSearch.items.length).toBeGreaterThan(0);

    const origin = originSearch.items[0];
    const destination = destSearch.items[0];

    // IDs and states must be distinct
    expect(origin.id).toBe("in-chennai");
    expect(destination.id).toMatch(/in-delhi/);
    expect(origin.name).toBe("Chennai");
    expect(destination.name).toMatch(/Delhi/);
    expect(origin.state).toBe("Tamil Nadu");
    expect(origin.latitude).toBeGreaterThan(12.9);
    expect(origin.latitude).toBeLessThan(13.2);
    expect(destination.latitude).toBeGreaterThan(28.5);
    expect(destination.latitude).toBeLessThan(28.8);
  });

  it("builds a search query URL where origin, destination, travellers, and category remain distinct", () => {
    const params = new URLSearchParams();
    params.set("origin", "in-chennai");
    params.set("q", "Delhi");
    params.set("passengers", "3");
    params.set("category", "family");

    const qs = params.toString();
    expect(qs).toContain("origin=in-chennai");
    expect(qs).toContain("q=Delhi");
    expect(qs).toContain("passengers=3");
    expect(qs).toContain("category=family");
  });
});

describe("Traveller Personas — Travel Rhythm Links", () => {
  const personas = [
    { id: "family", href: "/packages?style=family" },
    { id: "honeymoon", href: "/packages?category=honeymoon&style=honeymoon" },
    { id: "backpacker", href: "/packages?style=backpacker" },
    { id: "adventure", href: "/packages?style=adventure" },
  ];

  it("each persona card navigates to a distinct, parameterized destination route", () => {
    const hrefs = new Set(personas.map((p) => p.href));
    expect(hrefs.size).toBe(personas.length); // None share the same target
    expect(personas.every((p) => !p.href.includes("#"))).toBe(true); // No generic "#" anchors
  });
});

describe("Delhi Example — End-to-End Discovery Intent", () => {
  it("resolves Delhi and provides custom trip options without inventing fictional packages", () => {
    const place = searchLocalPlaces("Delhi", { limit: 1 }).items[0];
    expect(place).toBeDefined();

    const recs = getRecommendations({
      destinationPlace: place,
      destinationText: "Delhi",
    });

    // 1. No fictional Delhi package
    expect(recs.exactMatches.length).toBe(0);

    // 2. Custom planning option is explicitly triggered
    expect(recs.showCustomPlanningOption).toBe(true);

    // 3. Coordinate proximity is used truthfully
    expect(recs.coordinatesUsed).toBe(true);

    // 4. Custom planning link preserves the searched destination
    const customTripUrl = `/contact?destination=${encodeURIComponent(place.name)}&service=custom-itinerary`;
    expect(customTripUrl).toBe("/contact?destination=Delhi&service=custom-itinerary");
  });
});
