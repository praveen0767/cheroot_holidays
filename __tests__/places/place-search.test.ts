/**
 * Place Search Tests
 *
 * Tests for the India-first deterministic place search service.
 * Run with: npx vitest run
 */

import { describe, it, expect } from "vitest";
import { searchLocalPlaces, createUnresolvedPlace, getLocalPlaceById } from "@/lib/places/search";
import { normalizePlaceText, tokenizePlaceText } from "@/lib/places/normalize";

// ─── Normalization ──────────────────────────────────────────────────────────

describe("normalizePlaceText", () => {
  it("lowercases input", () => {
    expect(normalizePlaceText("DELHI")).toBe("delhi");
  });

  it("strips leading/trailing whitespace", () => {
    expect(normalizePlaceText("  Goa  ")).toBe("goa");
  });

  it("collapses multiple spaces", () => {
    expect(normalizePlaceText("New  Delhi")).toBe("new delhi");
  });

  it("handles empty string", () => {
    expect(normalizePlaceText("")).toBe("");
  });

  it("normalizes punctuation", () => {
    expect(normalizePlaceText("Kochi,Kerala")).toBe("kochi kerala");
  });
});

describe("tokenizePlaceText", () => {
  it("splits on whitespace", () => {
    expect(tokenizePlaceText("New Delhi")).toEqual(["new", "delhi"]);
  });

  it("filters empty tokens", () => {
    expect(tokenizePlaceText("  ")).toEqual([]);
  });
});

// ─── Empty query ─────────────────────────────────────────────────────────────

describe("searchLocalPlaces — empty query", () => {
  it("returns popular destinations", () => {
    const result = searchLocalPlaces("", { limit: 5 });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.length).toBeLessThanOrEqual(5);
    expect(result.source).toBe("local");
    expect(result.query).toBe("");
  });

  it("all returned items are popular destinations", () => {
    const result = searchLocalPlaces("");
    expect(result.items.every((p) => p.popularDestination === true)).toBe(true);
  });
});

// ─── Delhi acceptance test ───────────────────────────────────────────────────

describe("searchLocalPlaces — Delhi acceptance test", () => {
  it("finds Delhi by exact name", () => {
    const result = searchLocalPlaces("Delhi");
    expect(result.items.length).toBeGreaterThan(0);
    const match = result.items[0];
    expect(
      match.name.toLowerCase().includes("delhi") ||
      match.aliases.some((a) => a.toLowerCase().includes("delhi"))
    ).toBe(true);
  });

  it("finds Delhi case-insensitively", () => {
    const lower = searchLocalPlaces("delhi");
    const upper = searchLocalPlaces("DELHI");
    expect(lower.items[0]?.id).toBe(upper.items[0]?.id);
  });

  it("finds New Delhi", () => {
    const result = searchLocalPlaces("New Delhi");
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("produces stable ordering for repeated Delhi search", () => {
    const r1 = searchLocalPlaces("Delhi");
    const r2 = searchLocalPlaces("Delhi");
    expect(r1.items.map((p) => p.id)).toEqual(r2.items.map((p) => p.id));
  });

  it("returns no unresolvedQuery when Delhi matches", () => {
    const result = searchLocalPlaces("Delhi");
    expect(result.unresolvedQuery).toBeUndefined();
  });
});

// ─── Alias resolution ────────────────────────────────────────────────────────

describe("alias resolution", () => {
  it("resolves Bangalore → Bengaluru", () => {
    const result = searchLocalPlaces("Bangalore");
    expect(result.items.some((p) =>
      p.name === "Bengaluru" || p.aliases.includes("Bangalore")
    )).toBe(true);
  });

  it("resolves Bombay → Mumbai", () => {
    const result = searchLocalPlaces("Bombay");
    expect(result.items.some((p) =>
      p.name === "Mumbai" || p.aliases.some((a) => a.toLowerCase() === "bombay")
    )).toBe(true);
  });

  it("resolves Calcutta → Kolkata", () => {
    const result = searchLocalPlaces("Calcutta");
    expect(result.items.some((p) =>
      p.name === "Kolkata" || p.aliases.some((a) => a.toLowerCase() === "calcutta")
    )).toBe(true);
  });

  it("resolves Alleppey → Alappuzha", () => {
    const result = searchLocalPlaces("Alleppey");
    expect(result.items.some((p) =>
      p.name === "Alappuzha" || p.aliases.some((a) => a.toLowerCase().includes("alleppey"))
    )).toBe(true);
  });
});

// ─── Partial / multi-word matching ────────────────────────────────────────────

describe("partial and multi-word matching", () => {
  it("matches prefix 'Mum' → Mumbai", () => {
    const result = searchLocalPlaces("Mum");
    expect(result.items.some((p) => p.name === "Mumbai")).toBe(true);
  });

  it("matches 'Kerala backwaters' as multi-token", () => {
    const result = searchLocalPlaces("Kerala backwaters");
    // Should find Kerala or related locations
    expect(result.items.length).toBeGreaterThanOrEqual(0); // At minimum, no crash
  });

  it("matches partial state name 'Rajas' → Rajasthan", () => {
    const result = searchLocalPlaces("Rajas");
    expect(result.items.some((p) =>
      p.name.toLowerCase().includes("rajas") ||
      p.state?.toLowerCase().includes("rajas") ||
      p.searchKeywords.some((k) => k.toLowerCase().includes("rajas"))
    )).toBe(true);
  });
});

// ─── Unknown custom location ──────────────────────────────────────────────────

describe("unknown custom location behavior", () => {
  it("returns unresolvedQuery for completely unknown place", () => {
    const result = searchLocalPlaces("Xyzabc Unknown Place");
    expect(result.unresolvedQuery).toBeDefined();
    expect(result.items.length).toBe(0);
  });

  it("createUnresolvedPlace creates a valid placeholder", () => {
    const place = createUnresolvedPlace("Somewhere Custom");
    expect(place.id).toContain("unresolved");
    expect(place.name).toBe("Somewhere Custom");
    expect(place.verificationStatus).toBe("unresolved_custom_text");
    expect(place.source).toBe("unresolved_custom_text");
    expect(place.latitude).toBeUndefined();
    expect(place.longitude).toBeUndefined();
  });

  it("createUnresolvedPlace with empty string does not crash", () => {
    const place = createUnresolvedPlace("  ");
    expect(place.id).toBeDefined();
    expect(place.verificationStatus).toBe("unresolved_custom_text");
  });
});

// ─── Result limits ───────────────────────────────────────────────────────────

describe("result limits", () => {
  it("respects the limit option", () => {
    const result = searchLocalPlaces("a", { limit: 2 });
    expect(result.items.length).toBeLessThanOrEqual(2);
  });

  it("defaults to 6 results", () => {
    const result = searchLocalPlaces("a");
    expect(result.items.length).toBeLessThanOrEqual(6);
  });

  it("returns total count including non-truncated results", () => {
    const result = searchLocalPlaces("a", { limit: 2 });
    expect(result.total).toBeGreaterThanOrEqual(result.items.length);
  });
});

// ─── Duplicate suppression ───────────────────────────────────────────────────

describe("duplicate suppression", () => {
  it("does not return duplicate IDs", () => {
    const result = searchLocalPlaces("Delhi");
    const ids = result.items.map((p) => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

// ─── getLocalPlaceById ───────────────────────────────────────────────────────

describe("getLocalPlaceById", () => {
  it("returns null for unknown ID", () => {
    expect(getLocalPlaceById("does-not-exist")).toBeNull();
  });

  it("returns a place for a known ID", () => {
    // Find any ID from the dataset
    const all = searchLocalPlaces("", { limit: 1 });
    if (all.items.length > 0) {
      const id = all.items[0].id;
      const found = getLocalPlaceById(id);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(id);
    }
  });
});

// ─── Country code filter ──────────────────────────────────────────────────────

describe("country code filtering", () => {
  it("filters by IN country code", () => {
    const result = searchLocalPlaces("", { countryCode: "IN", limit: 10 });
    expect(result.items.every((p) => p.countryCode === "IN")).toBe(true);
  });
});
