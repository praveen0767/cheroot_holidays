"use client";

/**
 * TravelRhythm — Traveller Persona Discovery Strip
 *
 * Implements Part 10 of Cheroot Holidays Discovery Engine:
 * "Choose Your Travel Rhythm"
 *
 * Editorial cards representing 4 distinct travel personas:
 *   1. Family Escapes
 *   2. Couple & Honeymoon
 *   3. Backpacking
 *   4. Adventure & Outdoors
 *
 * Features:
 *   - Editorial photography with rich contrast overlays
 *   - Asymmetric/balanced proportions
 *   - Mobile horizontal-scroll with snap alignment
 *   - Desktop 4-column balanced grid
 *   - Preserves style context in URL (?style=family etc.)
 *   - Smooth transitions and accessible focus rings
 */

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface PersonaCard {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  image: string;
  href: string;
  accentColor: string;
}

const PERSONAS: PersonaCard[] = [
  {
    id: "family",
    title: "Family Escapes",
    badge: "All Generations",
    tagline: "Spacious stays, gentle pacing, and thoughtful itineraries designed to keep every generation smiling together.",
    image: "/packages/imported/water-boat-kerala-870x555-1.webp",
    href: "/packages?style=family",
    accentColor: "from-amber-600/90 to-slate-950/90",
  },
  {
    id: "honeymoon",
    title: "Couple & Honeymoon",
    badge: "Romance & Solitude",
    tagline: "Intimate villas, sunset cruises, and secluded corners crafted for moments that belong only to the two of you.",
    image: "/packages/bali-serenity-honeymoon.jpg",
    href: "/packages?category=honeymoon&style=honeymoon",
    accentColor: "from-rose-700/90 to-slate-950/90",
  },
  {
    id: "backpacker",
    title: "Backpacking",
    badge: "Free & Unscripted",
    tagline: "Budget-smart trails, scenic local routes, and vibrant social hubs for explorers who travel light and wander far.",
    image: "/packages/goa-coastal-getaway.jpg",
    href: "/packages?style=backpacker",
    accentColor: "from-indigo-700/90 to-slate-950/90",
  },
  {
    id: "adventure",
    title: "Adventure & Outdoors",
    badge: "High Altitudes & Wild Trails",
    tagline: "High-altitude passes, snow trails, and rugged terrains designed for travellers seeking an adrenaline rush.",
    image: "/packages/kashmir-snowline-journey.jpg",
    href: "/packages?style=adventure",
    accentColor: "from-emerald-700/90 to-slate-950/90",
  },
];

export default function TravelRhythm() {
  const { t, locale } = useTranslation();

  const personaTitles: Record<string, string> = {
    family: t("travelRhythm.family"),
    honeymoon: t("travelRhythm.couple"),
    backpacker: t("travelRhythm.backpacker"),
    adventure: t("travelRhythm.adventure"),
  };

  return (
    <section
      aria-labelledby="travel-rhythm-heading"
      className="py-16 sm:py-24 bg-surface-soft border-y border-line/60"
    >
      <div className="mx-auto max-w-[1536px] 2xl:max-w-[1680px] px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-bold tracking-wider text-brand-700 uppercase ring-1 ring-brand-200/60 mb-3">
            {t("travelRhythm.eyebrow")}
          </span>
          <h2
            id="travel-rhythm-heading"
            className="text-2xl sm:text-4xl font-extrabold text-ink-900 tracking-tight"
          >
            {t("travelRhythm.title")}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-ink-600 leading-relaxed">
            {t("travelRhythm.subtitle")}
          </p>
        </div>

        {/* Editorial cards: mobile horizontal snap strip, desktop 4-column grid */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible snap-x snap-mandatory">
          {PERSONAS.map((p) => (
            <Link
              key={p.id}
              href={p.href}
              className="group relative flex flex-col justify-end overflow-hidden rounded-3xl shrink-0 w-[280px] sm:w-auto h-[380px] sm:h-[420px] p-6 text-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-400 snap-center"
            >
              {/* Background photography */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={p.image}
                  alt={personaTitles[p.id] || p.title}
                  fill
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                {/* Rich layered gradient overlays for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-90 transition-opacity group-hover:opacity-95" />
                <div className={`absolute inset-0 bg-gradient-to-tr ${p.accentColor} mix-blend-multiply opacity-70 transition-opacity group-hover:opacity-85`} />
              </div>

              {/* Foreground content */}
              <div className="relative z-10 flex flex-col items-start">
                <span className="mb-2.5 inline-block rounded-full bg-white/20 px-3 py-0.5 text-[11px] font-bold tracking-wide uppercase text-white backdrop-blur-md ring-1 ring-white/30">
                  {p.badge}
                </span>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                  {personaTitles[p.id] || p.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-200/90 leading-relaxed line-clamp-3">
                  {p.tagline}
                </p>

                <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-brand-200 transition-colors group-hover:text-white">
                  <span>{locale === "ta" ? "தொகுப்புகளைக் காண்க" : "Explore packages"}</span>
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                    className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                  >
                    <path
                      d="M4 10h11m0 0-4-4m4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
