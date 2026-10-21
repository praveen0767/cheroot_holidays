"use client";

/**
 * NoResultsDiscovery
 *
 * Shown on the /packages page when a search query yields no matching packages.
 * Implements the "Delhi acceptance test" (Part 8 & Part 15) — never a dead end:
 *
 *   1. Explains clearly that no ready-made package exists for the searched place.
 *   2. Resolves geographical context (e.g. Delhi NCT, India).
 *   3. If coordinates exist, ranks catalogue destinations by authentic Haversine distance
 *      and explicitly labels them as "approx. straight-line" proximity.
 *   4. Offers a prominent "Plan a customised trip to [Destination]" CTA that preserves
 *      the destination in the enquiry context.
 *   5. Provides an easy "Clear search & filters" escape hatch.
 */

import { useMemo } from "react";
import Link from "next/link";
import { destinations } from "@/data/destinations";
import { searchLocalPlaces } from "@/lib/places/search";
import { getRecommendationsForPlace } from "@/lib/recommendations/nearestDestinations";
import { formatDistanceKm } from "@/lib/recommendations/distance";

interface NoResultsDiscoveryProps {
  searchQuery: string;
  onClear: () => void;
}

export default function NoResultsDiscovery({
  searchQuery,
  onClear,
}: NoResultsDiscoveryProps) {
  const query = searchQuery.trim();

  // Attempt to resolve known geographic place (e.g. "Delhi", "Bengaluru", "Mumbai")
  const resolvedPlace = useMemo(() => {
    if (!query) return null;
    const result = searchLocalPlaces(query, { limit: 1 });
    return result.items[0] ?? null;
  }, [query]);

  // If place is resolved with coordinates, calculate Haversine-ranked nearby catalogue destinations
  const nearbyDestinations = useMemo(() => {
    if (resolvedPlace && resolvedPlace.latitude !== undefined && resolvedPlace.longitude !== undefined) {
      return getRecommendationsForPlace(resolvedPlace, 4);
    }
    // Fallback: default catalogue destinations without distance
    return destinations.slice(0, 4).map((destination) => ({
      destination,
      distanceKm: null,
    }));
  }, [resolvedPlace]);

  // Custom trip URL preserving full destination intent
  const customTripHref = query
    ? `/contact?destination=${encodeURIComponent(query)}&service=custom-itinerary`
    : `/contact?service=custom-itinerary`;

  const placeDisplayName = resolvedPlace?.displayName || query;

  return (
    <div
      className="flex flex-col items-center py-12 sm:py-16 text-center max-w-4xl mx-auto"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Icon */}
      <div className="mb-5 flex size-16 sm:size-18 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-200/60 shadow-sm">
        <svg viewBox="0 0 32 32" fill="none" className="size-8 sm:size-9" aria-hidden="true">
          <circle cx="15" cy="15" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="m22 22 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M15 11v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Location Badge if resolved */}
      {resolvedPlace && (
        <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-surface-soft px-3.5 py-1 text-xs font-semibold text-ink-700 ring-1 ring-line">
          📍 {resolvedPlace.displayName} · {resolvedPlace.placeType.replace(/_/g, " ")}
        </span>
      )}

      {/* Headline */}
      <h2 className="text-xl font-bold text-ink-900 sm:text-2xl lg:text-3xl">
        {query ? (
          <>
            No ready-made package listed for &ldquo;
            <span className="text-brand-700">{query}</span>&rdquo; yet
          </>
        ) : (
          "No packages match your current filters"
        )}
      </h2>

      {/* Explanatory Context */}
      <p className="mt-3 max-w-xl text-sm sm:text-base text-ink-600 leading-relaxed">
        {query
          ? `We do not currently list a pre-packaged group tour for ${placeDisplayName}. However, our destination specialists can design a bespoke, tailor-made itinerary for you.`
          : "Try broadening your search terms or clearing your category filters to browse all our signature journeys."}
      </p>

      {/* ── Action buttons ─────────────────────────────────────────────────── */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
        {/* Primary: Plan customised trip */}
        <Link
          href={customTripHref}
          className="inline-flex h-11 sm:h-12 items-center gap-2 rounded-xl bg-brand-700 px-6 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(18,80,196,0.8)] transition-all hover:-translate-y-0.5 hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-brand-500"
        >
          <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
            <path d="M10 4v12m-6-6h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {query ? `Plan a customised trip to ${query}` : "Request a custom itinerary"}
        </Link>

        {/* Secondary: Clear filters */}
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-11 sm:h-12 items-center gap-2 rounded-xl border border-line bg-white px-5 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-brand-500 cursor-pointer"
        >
          Clear search & filters
        </button>
      </div>

      {/* ── Nearby / Alternative Listed Destination Ideas ───────────────────── */}
      {nearbyDestinations.length > 0 && (
        <div className="mt-12 w-full text-left">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-line/60 pb-3">
            <h3 className="text-xs sm:text-sm font-extrabold tracking-wider text-ink-900 uppercase">
              {resolvedPlace && resolvedPlace.latitude !== undefined
                ? `Closest Listed Travel Destinations from ${resolvedPlace.name}`
                : "Nearby Destination Ideas from Our Catalogue"}
            </h3>
            {resolvedPlace && resolvedPlace.latitude !== undefined && (
              <span className="text-[11px] text-ink-500 italic">
                Ranked by approximate straight-line proximity
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {nearbyDestinations.map(({ destination, distanceKm }) => (
              <Link
                key={destination.slug}
                href={`/packages?destination=${destination.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-brand-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-brand-500"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-ink-900 text-sm group-hover:text-brand-700 transition-colors">
                      {destination.name}
                    </p>
                    <span className="text-[10px] font-bold uppercase text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                      {destination.category}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-500 line-clamp-2 leading-relaxed">
                    {destination.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-line/40 flex items-center justify-between text-xs">
                  {distanceKm !== null ? (
                    <span className="text-[11px] font-medium text-ink-600">
                      {formatDistanceKm(distanceKm)}
                    </span>
                  ) : (
                    <span className="text-[11px] text-ink-500">Listed journey</span>
                  )}
                  <span className="font-semibold text-brand-700 group-hover:translate-x-0.5 transition-transform">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Help footnote ─────────────────────────────────────────────────── */}
      <p className="mt-10 text-xs text-ink-500">
        Looking for a specific route or offbeat destination?{" "}
        <Link
          href="/contact"
          className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-600"
        >
          Contact our destination specialists
        </Link>{" "}
        — we arrange custom journeys across all of India and international corridors.
      </p>
    </div>
  );
}
