"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { TravelPackage } from "@/data/packages";
import type { DestinationCandidate } from "@/data/destination-candidates";
import type { DestinationCategory } from "@/data/destinations";
import { searchPackages, tokenizeQuery } from "@/lib/search";
import PackageCard from "@/components/packages/PackageCard";
import DestinationCandidateCard from "@/components/packages/DestinationCandidateCard";
import NoResultsDiscovery from "@/components/packages/NoResultsDiscovery";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/LanguageContext";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type SortKey = "title" | "duration" | "price-asc" | "price-desc";

type FilterState = {
  category: DestinationCategory | "all";
  destination: string;
  search: string;
  sort: SortKey;
  /** Travel style / persona (from ?style= param or TravelRhythm strip) */
  style: string;
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold transition-all duration-200 cursor-pointer",
        active
          ? "bg-brand-700 text-white shadow-sm"
          : "bg-white text-ink-700 ring-1 ring-line hover:ring-brand-300 hover:text-brand-700",
      )}
    >
      {children}
    </button>
  );
}

// EmptyState is now handled by NoResultsDiscovery (imported above)

// ---------------------------------------------------------------------------
// Main Catalogue Component
// ---------------------------------------------------------------------------

export default function PackageCatalogue({
  packages,
  candidates,
  destinationOptions,
}: {
  packages: TravelPackage[];
  candidates: DestinationCandidate[];
  destinationOptions: Array<{ slug: string; name: string }>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale, t } = useTranslation();

  // Initialise from URL search params (enables shareable links)
  const [filters, setFilters] = useState<FilterState>(() => ({
    category: (searchParams.get("category") as DestinationCategory | null) ?? "all",
    destination: searchParams.get("destination") ?? "",
    search: searchParams.get("q") ?? "",
    sort: (searchParams.get("sort") as SortKey | null) ?? "title",
    style: searchParams.get("style") ?? "",
  }));

  // Sync incoming searchParams changes into state (adjusting state during render)
  const paramsKey = searchParams.toString();
  const [prevParamsKey, setPrevParamsKey] = useState(paramsKey);
  if (prevParamsKey !== paramsKey) {
    setPrevParamsKey(paramsKey);
    const nextCat = (searchParams.get("category") as DestinationCategory | null) ?? "all";
    const nextDest = searchParams.get("destination") ?? "";
    const nextSearch = searchParams.get("q") ?? "";
    const nextSort = (searchParams.get("sort") as SortKey | null) ?? "title";
    const nextStyle = searchParams.get("style") ?? "";
    setFilters({
      category: nextCat,
      destination: nextDest,
      search: nextSearch,
      sort: nextSort,
      style: nextStyle,
    });
  }

  // Sync filters back to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category !== "all") params.set("category", filters.category);
    if (filters.destination) params.set("destination", filters.destination);
    if (filters.search) params.set("q", filters.search);
    if (filters.sort !== "title") params.set("sort", filters.sort);
    if (filters.style) params.set("style", filters.style);
    const lang = searchParams.get("lang");
    if (lang) params.set("lang", lang);
    const qs = params.toString();
    const target = `${pathname}${qs ? `?${qs}` : ""}`;
    const current = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    if (target !== current) {
      router.replace(target, { scroll: false });
    }
  }, [filters, pathname, router, searchParams]);

  const update = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearAll = useCallback(() => {
    setFilters({ category: "all", destination: "", search: "", sort: "title", style: "" });
  }, []);

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.destination !== "" ||
    filters.search !== "" ||
    filters.style !== "";

  // ── Filter Packages ─────────────────────────────────────────────────────
  const filteredPackages = useMemo(() => {
    let result = [...packages];

    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.destination) {
      result = result.filter(
        (p) =>
          p.destinationSlug === filters.destination ||
          p.destination.toLowerCase().includes(filters.destination.toLowerCase()),
      );
    }

    if (filters.search.trim()) {
      result = searchPackages(result, filters.search);
    }

    // Sort
    switch (filters.sort) {
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "duration":
        result.sort((a, b) => (a.nights ?? 0) - (b.nights ?? 0));
        break;
      case "price-asc":
        result.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
        break;
      case "price-desc":
        result.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
        break;
    }

    return result;
  }, [packages, filters]);

  // ── Filter Candidates ───────────────────────────────────────────────────
  const filteredCandidates = useMemo(() => {
    let result = [...candidates];

    if (filters.category !== "all") {
      result = result.filter((c) => c.category === filters.category);
    }

    if (filters.destination) {
      result = result.filter(
        (c) =>
          c.destinationSlug === filters.destination ||
          c.countryOrRegion.toLowerCase().includes(filters.destination.toLowerCase()) ||
          c.destination.toLowerCase().includes(filters.destination.toLowerCase()),
      );
    }

    if (filters.search.trim()) {
      const tokens = tokenizeQuery(filters.search);
      result = result.filter((c) => {
        const text = `${c.title} ${c.destination} ${c.countryOrRegion}`.toLowerCase();
        return tokens.every((token) => text.includes(token));
      });
    }

    // Sort candidates primarily by destination name
    result.sort((a, b) => a.destination.localeCompare(b.destination));

    return result;
  }, [candidates, filters]);

  const totalResults = filteredPackages.length + filteredCandidates.length;

  const categoryLabels: Record<string, string> = {
    all: locale === "ta" ? "அனைத்து பயணங்கள்" : "All Journeys",
    international: locale === "ta" ? "சர்வதேச சுற்றுலா" : "International",
    domestic: locale === "ta" ? "உள்நாட்டு சுற்றுலா" : "Domestic",
    honeymoon: locale === "ta" ? "தேனிலவு சுற்றுலா" : "Honeymoon",
  };

  return (
    <div>
      {/* ── Filters bar ────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 border-b border-line bg-white/95 backdrop-blur-md">
        <div className="mx-auto w-full max-w-[1680px] px-4 py-4 sm:px-6 lg:px-8">

          {/* Top row: search + sort */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-600"
                aria-hidden="true"
              >
                <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="m14 14 2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                id="package-search"
                type="search"
                placeholder={t("packages.searchPlaceholder")}
                value={filters.search}
                onChange={(e) => update("search", e.target.value)}
                aria-label={t("packages.searchPlaceholder")}
                className="h-10 w-full rounded-full border border-line bg-surface-soft pl-9 pr-10 text-sm text-ink-900 placeholder:text-ink-600/60 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
              {filters.search && (
                <button
                  type="button"
                  onClick={() => update("search", "")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-ink-600 transition hover:bg-line hover:text-ink-900 cursor-pointer"
                >
                  <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
                    <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex shrink-0 items-center gap-2">
              <label
                htmlFor="package-sort"
                className="text-xs font-semibold text-ink-600 whitespace-nowrap"
              >
                {t("packages.sortBy")}
              </label>
              <select
                id="package-sort"
                value={filters.sort}
                onChange={(e) => update("sort", e.target.value as SortKey)}
                className="h-10 rounded-full border border-line bg-white pl-3 pr-8 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 cursor-pointer"
              >
                <option value="title">{locale === "ta" ? "பெயர் (அகரவரிசை)" : "Name A–Z"}</option>
                <option value="duration">{locale === "ta" ? "பயண காலம்" : "Duration"}</option>
                <option value="price-asc">{t("packages.priceLowHigh")}</option>
                <option value="price-desc">{t("packages.priceHighLow")}</option>
              </select>
            </div>
          </div>

          {/* Category chips & Destination dropdown */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {(["all", "international", "domestic", "honeymoon"] as const).map((cat) => (
              <FilterChip
                key={cat}
                active={filters.category === cat}
                onClick={() => update("category", cat)}
              >
                {categoryLabels[cat]}
              </FilterChip>
            ))}

            {/* Destination filter */}
            {destinationOptions.length > 0 && (
              <select
                id="destination-filter"
                value={filters.destination}
                onChange={(e) => update("destination", e.target.value)}
                aria-label="Filter by destination"
                className={cn(
                  "inline-flex h-9 items-center rounded-full border px-4 text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-200",
                  filters.destination
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-line bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700",
                )}
              >
                <option value="">{t("packages.allDestinations")}</option>
                {destinationOptions.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-ink-600 ring-1 ring-line transition hover:bg-red-50 hover:text-red-600 hover:ring-red-200 cursor-pointer"
              >
                <svg viewBox="0 0 20 20" fill="none" className="size-3.5" aria-hidden="true">
                  <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                {t("packages.resetFilters")}
              </button>
            )}
          </div>

          {/* Results count indicator */}
          <p className="mt-2 text-xs text-ink-600" aria-live="polite" aria-atomic="true">
            {totalResults === 0
              ? filters.search
                ? locale === "ta"
                  ? `"${filters.search}" தேடலுக்கு எந்த பயணங்களும் கிடைக்கவில்லை`
                  : `No journeys match "${filters.search}"`
                : locale === "ta"
                  ? "வடிகட்டிகளுக்கு பொருந்தும் பயணங்கள் இல்லை"
                  : "No journeys match your filters"
              : locale === "ta"
                ? `${totalResults} பயணங்கள் காட்டப்படுகின்றன${filters.search ? ` ("${filters.search}" தேடல்)` : ""} (${filteredPackages.length} தொகுப்புகள், ${filteredCandidates.length} தனிப்பயன் இடங்கள்)`
                : `Showing ${totalResults} journeys${filters.search ? ` matching "${filters.search}"` : ""} (${filteredPackages.length} package${filteredPackages.length === 1 ? "" : "s"}, ${filteredCandidates.length} custom destination${filteredCandidates.length === 1 ? "" : "s"})`}
            {hasActiveFilters && (locale === "ta" ? " · வடிகட்டிகள் தேர்வு செய்யப்பட்டுள்ளன" : " · filters active")}
          </p>
        </div>
      </div>

      {/* ── Main Catalogue View ─────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-[1680px] px-4 py-10 sm:px-6 lg:px-8 space-y-16">
        {totalResults === 0 ? (
          <NoResultsDiscovery searchQuery={filters.search || filters.destination} onClear={clearAll} />
        ) : (
          <>
            {/* ── SECTION A: Existing Package Offerings ──────────────────── */}
            {filteredPackages.length > 0 && (
              <section aria-labelledby="curated-packages-heading">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
                  <div>
                    <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
                      {locale === "ta" ? "சிறப்புப் பயணங்கள்" : "Curated Journeys"}
                    </span>
                    <h2
                      id="curated-packages-heading"
                      className="mt-1 text-2xl font-extrabold text-ink-900 sm:text-3xl"
                    >
                      {locale === "ta" ? "சிறந்த சுற்றுலாத் தொகுப்புகள்" : "Featured Tour Packages"}
                    </h2>
                    <p className="mt-1 text-sm text-ink-600">
                      {locale === "ta"
                        ? "முழுமையான வசதிகள், வெளிப்படையான கட்டணங்கள் மற்றும் பிரத்யேக பயண வழிகாட்டல்."
                        : "Signature itineraries with verified structures and dedicated travel assistance."}
                    </p>
                  </div>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                    {filteredPackages.length} {locale === "ta" ? "தொகுப்புகள்" : filteredPackages.length === 1 ? "Package" : "Packages"}
                  </span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredPackages.map((pkg, i) => (
                    <Reveal key={pkg.slug} delay={i * 50}>
                      <PackageCard pkg={pkg} className="h-full" />
                    </Reveal>
                  ))}
                </div>
              </section>
            )}

            {/* ── SECTION B: Recovered Destination Candidates ───────────── */}
            {filteredCandidates.length > 0 && (
              <section aria-labelledby="custom-destinations-heading">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
                  <div>
                    <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
                      {locale === "ta" ? "சுற்றுலாத் தலங்கள் காப்பகம்" : "Destination Archive · Explore & Customise"}
                    </span>
                    <h2
                      id="custom-destinations-heading"
                      className="mt-1 text-2xl font-extrabold text-ink-900 sm:text-3xl"
                    >
                      {locale === "ta" ? "இடங்களை ஆராய்ந்து திட்டமிடுங்கள்" : "Explore Destinations & Tailor-Made Trips"}
                    </h2>
                    <p className="mt-1 text-sm text-ink-600">
                      {locale === "ta"
                        ? "எங்கள் சுற்றுலா நெட்வொர்க்கின் உண்மையான புகைப்படங்கள். உங்கள் விருப்பப்படி பிரத்யேகமாக திட்டமிடப்படும்."
                        : "Recovered photographs from our travel network. Every itinerary is planned on request to your preferred dates, budget and group size."}
                    </p>
                  </div>
                  <span className="rounded-full bg-surface-soft px-3 py-1 text-xs font-bold text-ink-700 ring-1 ring-line">
                    {filteredCandidates.length} {locale === "ta" ? "இடங்கள்" : filteredCandidates.length === 1 ? "Destination" : "Destinations"}
                  </span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredCandidates.map((candidate, i) => (
                    <Reveal key={candidate.id} delay={Math.min(i * 30, 400)}>
                      <DestinationCandidateCard candidate={candidate} className="h-full" />
                    </Reveal>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
