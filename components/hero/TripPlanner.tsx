"use client";

/**
 * TripPlanner — India-First Dual-Input Travel Discovery
 *
 * Two-field search architecture:
 *   1. "Starting from" — user's origin (with place autocomplete)
 *   2. "Where would you like to go?" — destination (with place autocomplete)
 *
 * Each field queries /api/places/search for deterministic suggestions.
 * Falls back to package/destination data for the destination field.
 * Unresolved custom text is preserved for the enquiry context.
 */

import { useState, useRef, useEffect, useId, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { PlaceRecord, PlaceSearchResult } from "@/lib/places/types";
import { useTranslation } from "@/lib/i18n/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlaceSuggestion {
  record: PlaceRecord;
  isCustom?: boolean;
}

interface TripPlannerProps {
  className?: string;
  /** 'hero' = rendered inside the full-bleed cinematic hero section */
  variant?: "default" | "hero";
}

type ActiveField = "origin" | "destination" | null;

// ─── Debounce hook ────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

// ─── Place search hook ────────────────────────────────────────────────────────

function usePlaceSearch(query: string, enabled: boolean, locale?: string): {
  suggestions: PlaceSuggestion[];
  loading: boolean;
} {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const loc = locale === "ta" ? "ta" : "en";

    if (!debouncedQuery.trim()) {
      // Show popular destinations
      fetch(`/api/places/search?limit=6&locale=${loc}`)
        .then((r) => r.json() as Promise<PlaceSearchResult>)
        .then((data) => {
          if (!cancelled) setSuggestions(data.items.map((r) => ({ record: r })));
        })
        .catch(() => {
          if (!cancelled) setSuggestions([]);
        });
      return () => {
        cancelled = true;
      };
    }

    const timer = setTimeout(() => {
      if (!cancelled) setLoading(true);
    }, 0);

    const url = `/api/places/search?q=${encodeURIComponent(debouncedQuery)}&limit=6&locale=${loc}`;
    fetch(url)
      .then((r) => r.json() as Promise<PlaceSearchResult>)
      .then((data) => {
        if (cancelled) return;
        const items: PlaceSuggestion[] = data.items.map((r) => ({ record: r }));
        // If no match, provide custom option
        if (items.length === 0 && debouncedQuery.trim()) {
          items.push({
            record: {
              id: `custom-${debouncedQuery}`,
              name: debouncedQuery.trim(),
              displayName:
                loc === "ta"
                  ? `${debouncedQuery.trim()} (தனிப்பயன் இடம்)`
                  : `${debouncedQuery.trim()} (Custom Location)`,
              placeType: "destination",
              country: loc === "ta" ? "இந்தியா" : "India",
              countryCode: "IN",
              aliases: [],
              searchKeywords: [],
              source: "unresolved_custom_text",
              verificationStatus: "unresolved_custom_text",
            },
            isCustom: true,
          });
        }
        setSuggestions(items);
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [debouncedQuery, enabled, locale]);

  return { suggestions, loading };
}

// ─── PlaceInput sub-component ─────────────────────────────────────────────────

interface PlaceInputProps {
  id: string;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  selected: PlaceRecord | null;
  isActive: boolean;
  locale?: string;
  onFocus: () => void;
  onChange: (text: string) => void;
  onSelect: (record: PlaceRecord) => void;
  onClear: () => void;
}

function PlaceInput({
  id,
  label,
  placeholder,
  icon,
  value,
  isActive,
  locale,
  onFocus,
  onChange,
  onSelect,
  onClear,
}: PlaceInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { suggestions, loading } = usePlaceSearch(value, isActive, locale);
  const [highlighted, setHighlighted] = useState(-1);

  useEffect(() => {
    if (isActive) inputRef.current?.focus();
  }, [isActive]);

  const safeHighlighted = highlighted >= 0 && highlighted < suggestions.length ? highlighted : -1;

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isActive || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => (h + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => (h - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && safeHighlighted >= 0) {
      e.preventDefault();
      onSelect(suggestions[safeHighlighted].record);
    } else if (e.key === "Escape") {
      onClear();
    }
  };

  return (
    <div className={cn("relative flex-1 min-w-0", isActive && "z-30")}>
      <label htmlFor={id} className="sr-only">{label}</label>
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-4 size-5 text-brand-600 shrink-0" aria-hidden="true">
          {icon}
        </span>
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={isActive && suggestions.length > 0}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          onFocus={() => {
            setHighlighted(-1);
            onFocus();
          }}
          onChange={(e) => {
            setHighlighted(-1);
            onChange(e.target.value);
          }}
          onKeyDown={handleKey}
          className="h-10 w-full rounded-xl border border-line bg-surface-soft pl-11 pr-9 text-sm font-medium text-ink-900 placeholder:font-normal placeholder:text-ink-600/60 transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            aria-label={`Clear ${label}`}
            className={cn(
              "absolute grid size-6 place-items-center rounded-full text-ink-500 transition hover:bg-line/60 hover:text-ink-900 cursor-pointer",
              loading ? "right-8" : "right-3",
            )}
          >
            <svg viewBox="0 0 20 20" fill="none" className="size-3.5" aria-hidden="true">
              <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        )}
        {loading && (
          <span className="absolute right-3 size-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" aria-hidden="true" />
        )}
      </div>

      {/* Suggestions dropdown with independent scrolling and controlled max height */}
      {isActive && suggestions.length > 0 && (
        <div
          id={`${id}-list`}
          role="listbox"
          className="absolute top-full left-0 z-50 mt-2 max-h-72 w-full min-w-[280px] overflow-y-auto overscroll-contain rounded-2xl border border-line bg-white py-1.5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150"
          style={{ scrollbarWidth: "thin" }}
        >
          <div className="sticky top-0 z-10 bg-white/95 px-3 py-1.5 text-[10px] font-bold tracking-wider text-ink-500 uppercase border-b border-line/50 backdrop-blur-sm">
            {value.trim()
              ? locale === "ta"
                ? "பொருந்தும் இடங்கள்"
                : "Matching Places"
              : locale === "ta"
                ? "பிரபலமான தலங்கள்"
                : "Popular Destinations"}
          </div>
          {suggestions.map((s, i) => {
            const isH = i === highlighted;
            return (
              <button
                key={s.record.id}
                type="button"
                role="option"
                aria-selected={isH}
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => onSelect(s.record)}
                className={cn(
                  "flex w-full items-start gap-3 px-3.5 py-2 text-left text-sm transition-colors cursor-pointer",
                  isH ? "bg-brand-50 text-brand-900" : "text-ink-900 hover:bg-surface-soft",
                )}
              >
                <span className="mt-0.5 shrink-0 text-base">
                  {s.isCustom ? "📍" : getPlaceEmoji(s.record.placeType)}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold truncate">{s.record.name}</p>
                  <p className="text-xs text-ink-500 truncate">
                    {s.isCustom
                      ? locale === "ta"
                        ? "தனிப்பயன் இடம் — உங்கள் விருப்பப்படி திட்டமிடுவோம்"
                        : "Custom location — we'll plan around it"
                      : s.record.displayName}
                  </p>
                </div>
                {s.record.popularDestination && (
                  <span className="ml-auto shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700 ring-1 ring-amber-200">
                    {locale === "ta" ? "பிரபலம்" : "Popular"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getPlaceEmoji(type: PlaceRecord["placeType"]): string {
  switch (type) {
    case "hill_station": return "⛰️";
    case "pilgrimage": return "🛕";
    case "heritage": return "🏛️";
    case "international_destination": return "✈️";
    case "metro": return "🏙️";
    case "destination": return "🌴";
    default: return "📍";
  }
}

// ─── Main TripPlanner ─────────────────────────────────────────────────────────

export default function TripPlanner({ className, variant = "default" }: TripPlannerProps) {
  const router = useRouter();
  const { locale, t } = useTranslation();

  const originInputId = useId();
  const destInputId = useId();
  const styleSelectId = useId();

  const [originText, setOriginText] = useState("");
  const [destText, setDestText] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [travellers, setTravellers] = useState(2);

  const incrementTravellers = () => setTravellers((c) => Math.min(c + 1, 30));
  const decrementTravellers = () => setTravellers((c) => Math.max(c - 1, 1));

  const [originPlace, setOriginPlace] = useState<PlaceRecord | null>(null);
  const [destPlace, setDestPlace] = useState<PlaceRecord | null>(null);

  const [activeField, setActiveField] = useState<ActiveField>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveField(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOriginChange = useCallback((text: string) => {
    setOriginText(text);
    setOriginPlace(null); // Reset resolved place on new text
  }, []);

  const handleDestChange = useCallback((text: string) => {
    setDestText(text);
    setDestPlace(null);
  }, []);

  const handleOriginSelect = useCallback((record: PlaceRecord) => {
    setOriginPlace(record);
    setOriginText(record.name);
    setActiveField("destination"); // Auto-advance focus
  }, []);

  const handleDestSelect = useCallback((record: PlaceRecord) => {
    setDestPlace(record);
    setDestText(record.name);
    setActiveField(null);
  }, []);

  const clearOrigin = useCallback(() => {
    setOriginText("");
    setOriginPlace(null);
    setActiveField("origin");
  }, []);

  const clearDest = useCallback(() => {
    setDestText("");
    setDestPlace(null);
    setActiveField("destination");
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActiveField(null);

    const params = new URLSearchParams();

    // Use resolved destination place's associated slug if available
    const destSlug = destPlace?.associatedDestinationSlug;
    if (destSlug) {
      params.set("destination", destSlug);
    } else if (destText.trim()) {
      params.set("q", destText.trim());
    }

    if (travelStyle) params.set("category", travelStyle);
    params.set("passengers", String(travellers));

    if (originPlace?.id) params.set("origin", originPlace.id);
    else if (originText.trim()) params.set("origin_text", originText.trim());

    if (locale === "ta") params.set("lang", "ta");

    const qs = params.toString();
    router.push(`/packages${qs ? `?${qs}` : ""}`);
  };

  const handlePillClick = (dest: string) => {
    setDestText(dest);
    setDestPlace(null);
    const langSuffix = locale === "ta" ? "&lang=ta" : "";
    router.push(`/packages?q=${encodeURIComponent(dest)}${langSuffix}`);
  };

  const travelStyles = [
    { value: "", label: t("tripPlanner.anyTravelStyle") },
    { value: "honeymoon", label: t("tripPlanner.styleHoneymoon") },
    { value: "family", label: t("tripPlanner.styleFamily") },
    { value: "adventure", label: t("tripPlanner.styleAdventure") },
    { value: "backpacker", label: t("tripPlanner.styleBackpacker") },
    { value: "group", label: t("tripPlanner.styleGroup") },
    { value: "luxury", label: t("tripPlanner.styleLuxury") },
  ];

  const popularPills = [
    { label: locale === "ta" ? "கோவா கடற்கரைகள்" : "Goa beaches", dest: "Goa" },
    { label: locale === "ta" ? "பாலி தேனிலவு" : "Bali honeymoon", dest: "Bali" },
    { label: locale === "ta" ? "கேரளா உப்பங்கழிகள்" : "Kerala backwaters", dest: "Kerala" },
    { label: locale === "ta" ? "காஷ்மீர்" : "Kashmir", dest: "Kashmir" },
    { label: locale === "ta" ? "மாலத்தீவு" : "Maldives", dest: "Maldives" },
    { label: locale === "ta" ? "துபாய்" : "Dubai", dest: "Dubai" },
  ];

  const originIcons = (
    <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
      <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 2C6.686 2 4 4.686 4 8c0 4 6 10 6 10s6-6 6-10c0-3.314-2.686-6-6-6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );

  const destIcons = (
    <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="m13.5 13.5 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );

  return (
    <div ref={containerRef} className={cn("w-full max-w-5xl mx-auto", className)}>
      {/* ── Main Search Card ─────────────────────────────────────────── */}
      <div
        className={cn(
          "relative rounded-2xl backdrop-blur-md transition-all duration-300",
          variant === "hero"
            ? "border border-white/80 bg-white/95 p-3 sm:p-4 shadow-[0_25px_60px_-20px_rgba(7,35,90,0.45)] ring-1 ring-white/40"
            : "border border-line bg-white p-4 sm:p-5 shadow-xl",
        )}
      >
        <div className="mb-2 px-1 flex items-center gap-2">
          <span className="text-[10px] sm:text-xs font-extrabold tracking-wider text-brand-700 uppercase">
            {t("tripPlanner.title")}
          </span>
          <span className="h-px flex-1 bg-line/60" aria-hidden="true" />
        </div>

        <form onSubmit={handleSearch} className="space-y-2">
          {/* ── Origin + Destination row ─────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-2 items-stretch">
            {/* Starting from */}
            <PlaceInput
              id={originInputId}
              label={t("tripPlanner.startingFrom")}
              placeholder={t("tripPlanner.startingFromPlaceholder")}
              icon={originIcons}
              value={originText}
              selected={originPlace}
              isActive={activeField === "origin"}
              locale={locale}
              onFocus={() => setActiveField("origin")}
              onChange={handleOriginChange}
              onSelect={handleOriginSelect}
              onClear={clearOrigin}
            />

            {/* Swap divider */}
            <div className="hidden sm:flex items-center shrink-0">
              <span className="text-ink-400 text-xs font-bold">→</span>
            </div>

            {/* Destination */}
            <PlaceInput
              id={destInputId}
              label={t("tripPlanner.destination")}
              placeholder={t("tripPlanner.destinationPlaceholder")}
              icon={destIcons}
              value={destText}
              selected={destPlace}
              isActive={activeField === "destination"}
              locale={locale}
              onFocus={() => setActiveField("destination")}
              onChange={handleDestChange}
              onSelect={handleDestSelect}
              onClear={clearDest}
            />
          </div>

          {/* ── Travellers + Travel style + Explore Trips row ───────── */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            {/* Travellers stepper [ - 2 + ] */}
            <div className="sm:col-span-3 flex h-10 items-center justify-between rounded-xl border border-line bg-surface-soft px-3 text-xs sm:text-sm font-semibold text-ink-800">
              <span className="text-ink-500 text-xs font-medium mr-1">{t("tripPlanner.travellers")}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={decrementTravellers}
                  disabled={travellers <= 1}
                  aria-label={t("tripPlanner.decreaseTravellers")}
                  className={cn(
                    "grid size-6 place-items-center rounded-md border border-line bg-white text-ink-700 transition hover:bg-brand-50 hover:text-brand-700 cursor-pointer",
                    travellers <= 1 && "opacity-40 cursor-not-allowed hover:bg-white hover:text-ink-700",
                  )}
                >
                  <span className="text-sm font-bold leading-none">−</span>
                </button>
                <span className="min-w-[1.25rem] text-center font-bold text-ink-900" aria-live="polite">
                  {travellers}
                </span>
                <button
                  type="button"
                  onClick={incrementTravellers}
                  disabled={travellers >= 30}
                  aria-label={t("tripPlanner.increaseTravellers")}
                  className={cn(
                    "grid size-6 place-items-center rounded-md border border-line bg-white text-ink-700 transition hover:bg-brand-50 hover:text-brand-700 cursor-pointer",
                    travellers >= 30 && "opacity-40 cursor-not-allowed hover:bg-white hover:text-ink-700",
                  )}
                >
                  <span className="text-sm font-bold leading-none">+</span>
                </button>
              </div>
            </div>

            {/* Travel style */}
            <div className="sm:col-span-5">
              <label htmlFor={styleSelectId} className="sr-only">{t("tripPlanner.travelStyle")}</label>
              <select
                id={styleSelectId}
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="h-10 w-full rounded-xl border border-line bg-surface-soft px-3 text-xs sm:text-sm font-semibold text-ink-700 transition hover:border-brand-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100 cursor-pointer"
              >
                {travelStyles.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Explore Trips button */}
            <button
              type="submit"
              className="sm:col-span-4 group flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 text-xs sm:text-sm font-bold text-white shadow-[0_10px_20px_-10px_rgba(18,80,196,0.8)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-brand-500 cursor-pointer"
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
                <path d="m13.5 13.5 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span>{t("tripPlanner.exploreTrips")}</span>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5">
                <path d="M4 10h11m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </form>

        {/* ── Quick Discovery Pills ─────────────────────────────────── */}
        <div className={cn(
          "flex flex-wrap items-center gap-1.5 text-xs",
          variant === "hero"
            ? "mt-2 pt-2 border-t border-line/60"
            : "mt-3.5 pt-3 border-t border-line/60",
        )}>
          <span className="font-semibold text-ink-600 mr-1">{t("tripPlanner.popular")}</span>
          {popularPills.map((pill) => (
            <button
              key={pill.dest}
              type="button"
              onClick={() => handlePillClick(pill.dest)}
              className="rounded-full bg-brand-50/80 px-2.5 py-1 font-medium text-brand-700 transition hover:bg-brand-100 hover:text-brand-900 cursor-pointer"
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
