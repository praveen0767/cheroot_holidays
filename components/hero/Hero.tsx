"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { getHeroFeaturedPackages, type TravelPackage, PLACEHOLDER_IMAGE } from "@/data/packages";
import TripPlanner from "@/components/hero/TripPlanner";
import { formatINR, cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/LanguageContext";

function subscribeReducedMotion(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getReducedMotionSnapshot = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getReducedMotionServerSnapshot = () => false;

const SLIDE_DURATION = 6500; // ms

interface HeroProps {
  initialPackages?: TravelPackage[];
}

export default function Hero({ initialPackages }: HeroProps) {
  const { t } = useTranslation();
  const packages = initialPackages || getHeroFeaturedPackages(5);
  const total = packages.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((cur) => {
      setPrevIndex(cur);
      return (cur + 1) % total;
    });
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((cur) => {
      setPrevIndex(cur);
      return (cur - 1 + total) % total;
    });
  }, [total]);

  const goToSlide = useCallback((index: number) => {
    if (index === activeIndex) return;
    setPrevIndex(activeIndex);
    setActiveIndex(index);
  }, [activeIndex]);

  // Auto-advance with pause support
  useEffect(() => {
    if (prefersReducedMotion || isPaused || total <= 1) return;
    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, prefersReducedMotion, total]);

  // Clear prevIndex after transition finishes
  useEffect(() => {
    if (prevIndex === null) return;
    const timer = setTimeout(() => setPrevIndex(null), 900);
    return () => clearTimeout(timer);
  }, [prevIndex]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 45) {
      prevSlide();
    } else if (deltaX < -45) {
      nextSlide();
    }
    touchStartX.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    }
  };

  if (total === 0) return null;

  const currentPkg = packages[activeIndex];

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Cheroot Holidays — Featured Destination Showcase"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-x-clip select-none"
    >
      {/* ── Full-bleed photographic background slideshow ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {packages.map((pkg, i) => {
          const isActive = i === activeIndex;
          const isPrev = i === prevIndex;
          const src = imageErrors[pkg.slug]
            ? PLACEHOLDER_IMAGE
            : pkg.image || PLACEHOLDER_IMAGE;

          if (!isActive && !isPrev) return null;

          return (
            <div
              key={pkg.slug}
              className="absolute inset-0"
              style={{
                transition: prefersReducedMotion
                  ? "none"
                  : "opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 2 : 1,
              }}
            >
              <Image
                src={src}
                alt={`${pkg.destination} — ${pkg.title}`}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover object-center"
                style={{
                  transform:
                    isActive && !prefersReducedMotion
                      ? "scale(1.04)"
                      : "scale(1)",
                  transition: isActive
                    ? `transform ${SLIDE_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
                    : "none",
                }}
                onError={() =>
                  setImageErrors((p) => ({ ...p, [pkg.slug]: true }))
                }
              />
            </div>
          );
        })}
      </div>

      {/* ── Multi-layer depth gradients for readability & color richness ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(7,35,90,0.74) 0%, rgba(7,35,90,0.38) 32%, rgba(7,35,90,0.22) 55%, rgba(7,35,90,0.60) 80%, rgba(4,19,51,0.92) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse 90% 100% at 50% 50%, transparent 40%, rgba(4,19,51,0.55) 100%)",
        }}
      />

      {/* ── Carousel side navigation (absolute, non-blocking) ── */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label={t("hero.prevSlide")}
            className="hero-fadein absolute left-3 top-1/2 z-30 -translate-y-1/2 grid size-9 place-items-center rounded-full border border-white/25 bg-brand-950/60 text-white backdrop-blur-md transition hover:bg-brand-700 hover:border-white/40 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-300 hidden sm:grid"
          >
            <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
              <path d="M12.5 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label={t("hero.nextSlide")}
            className="hero-fadein absolute right-3 top-1/2 z-30 -translate-y-1/2 grid size-9 place-items-center rounded-full border border-white/25 bg-brand-950/60 text-white backdrop-blur-md transition hover:bg-brand-700 hover:border-white/40 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-300 hidden sm:grid"
          >
            <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
              <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {/* ── Main Hero Content Layer ──
          Layout: flex-col, top-aligned at header offset, no justify-center.
          This ensures the planner stays in viewport without overflow.
      ── */}
      <div
        className="relative z-20 flex flex-col items-center px-4 sm:px-6 lg:px-8"
        style={{
          /* Push content below the fixed header (64px mobile / 80px desktop) */
          paddingTop: "calc(var(--header-h, 80px) + clamp(1rem, 2.5svh, 2rem))",
          paddingBottom: "clamp(1rem, 2.5svh, 2rem)",
          minHeight: "100svh",
        }}
      >
        {/* Active Destination & Journey Pill */}
        <div className="hero-fadein mb-2 sm:mb-3 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-brand-950/60 px-3 py-1 text-[10px] sm:text-xs font-bold tracking-widest text-white uppercase backdrop-blur-md">
            <span className="size-1.5 animate-pulse rounded-full bg-brand-300" />
            {t("hero.featuredJourney", {
              current: activeIndex + 1,
              total,
              destination: currentPkg.destination,
            })}
          </span>
          {typeof currentPkg.nights === "number" && typeof currentPkg.days === "number" && (
            <span className="hidden sm:inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
              {t("hero.nightsDays", { nights: currentPkg.nights, days: currentPkg.days })}
            </span>
          )}
          {typeof currentPkg.price === "number" && currentPkg.price > 0 ? (
            <span className="inline-flex items-center rounded-full border border-amber-400/40 bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-200 backdrop-blur-md">
              {t("hero.fromPricePerPerson", { price: formatINR(currentPkg.price) })}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur-md">
              {t("hero.quoteOnEnquiry")}
            </span>
          )}
        </div>

        {/* Headline — responsive clamp so Tamil text doesn't push planner below fold.
           At 1366px: clamp(1.75rem, 3.5vw + 0.25rem, 3.25rem) ≈ 3.25rem ≈ 52px
           At 1280px: 3.5 × 12.8 + 4 ≈ 48.8px → clamped to 3.25rem */}
        <h1
          className="hero-fadein hero-fadein-delay-1 hero-heading max-w-4xl text-center font-extrabold leading-[1.12] tracking-tight text-white drop-shadow-md"
          style={{
            fontSize: "clamp(1.6rem, 3.5vw + 0.25rem, 3.25rem)",
          }}
        >
          {t("hero.headlinePrefix")}{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #5aa4f5 0%, #93c4fa 50%, #f59e0b 100%)",
            }}
          >
            {t("hero.headlineHighlight")}
          </span>
          <br className="hidden sm:block" /> {t("hero.headlineSuffix")}
        </h1>

        {/* Supporting text — one concise line on desktop, truncated on shorter viewports */}
        <p
          className="hero-fadein hero-fadein-delay-2 mt-2 sm:mt-3 max-w-xl text-center text-xs sm:text-sm lg:text-base leading-relaxed text-white/85"
          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {t("hero.activePackageIntro", {
            title: currentPkg.title,
            description:
              currentPkg.description ||
              `Thoughtfully curated travel through ${currentPkg.destination} with private transfers, handpicked stays, and local support.`,
          })}
        </p>

        {/* ── Persistent Floating Search Planner ── */}
        <div className="hero-fadein hero-fadein-delay-3 mt-3 sm:mt-4 w-full max-w-4xl relative z-30">
          <TripPlanner variant="hero" />
        </div>

        {/* ── Compact secondary CTAs row + slide dots ── */}
        <div className="hero-fadein hero-fadein-delay-4 mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {/* Primary dynamic CTA linked to active package */}
          <Link
            href={`/packages/${currentPkg.slug}`}
            className="group inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-[0_8px_20px_-6px_rgba(47,134,239,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-400 hover:shadow-[0_12px_24px_-6px_rgba(47,134,239,0.85)] focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
          >
            <span>{t("hero.exploreJourney", { destination: currentPkg.destination })}</span>
            <svg
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
            >
              <path
                d="M4 10h11m0 0-4-4m4 4-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {/* Secondary All Packages CTA */}
          <Link
            href="/packages"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:border-white/50 cursor-pointer"
          >
            {t("hero.browseAllPackages")}
          </Link>

          {/* Plan My Trip CTA — hidden on small screens to save space */}
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-brand-950/40 px-4 py-2 text-xs sm:text-sm font-semibold text-brand-100 backdrop-blur-md transition-all duration-200 hover:bg-white/15 hover:text-white cursor-pointer"
          >
            {t("hero.planMyTrip")}
          </Link>

          {/* "Discover How We Plan" scroll anchor — desktop only */}
          <a
            href="#how-we-plan"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("how-we-plan");
              if (el) {
                el.scrollIntoView({
                  behavior: prefersReducedMotion ? "auto" : "smooth",
                });
              }
            }}
            aria-label={t("hero.discoverHowWePlan")}
            className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-md transition-all duration-200 hover:bg-white/15 hover:text-white cursor-pointer"
          >
            <svg viewBox="0 0 20 20" fill="none" className="size-3.5 text-brand-300" aria-hidden="true">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 6v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>{t("hero.discoverHowWePlan")}</span>
          </a>

          {/* ── Dot-only slide indicators (inline with CTAs, minimal footprint) ── */}
          {total > 1 && (
            <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-brand-950/50 px-2.5 py-1.5 backdrop-blur-md">
              {packages.map((pkg, i) => (
                <button
                  key={pkg.slug}
                  type="button"
                  onClick={() => goToSlide(i)}
                  aria-label={t("hero.goToSlide", {
                    index: i + 1,
                    destination: pkg.destination,
                    title: pkg.title,
                  })}
                  aria-current={i === activeIndex ? "true" : undefined}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                    i === activeIndex
                      ? "w-5 bg-brand-400"
                      : "w-1.5 bg-white/40 hover:bg-white/70",
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Spacer that pushes trust strip to the bottom when there is extra space */}
        <div className="flex-1" aria-hidden="true" />
      </div>

      {/* ── Trust Strip anchored to bottom of hero ── */}
      <div className="relative z-20 border-t border-white/10 bg-brand-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-around gap-3 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-extrabold text-white sm:text-base">5,000+</span>
            <span className="text-[10px] font-medium text-white/70 sm:text-[11px]">{t("trust.happyTravellers")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-extrabold text-white sm:text-base">120+</span>
            <span className="text-[10px] font-medium text-white/70 sm:text-[11px]">{t("trust.curatedPackages")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-extrabold text-white sm:text-base">15+</span>
            <span className="text-[10px] font-medium text-white/70 sm:text-[11px]">{t("trust.destinations")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-extrabold text-white sm:text-base">4.9★</span>
            <span className="text-[10px] font-medium text-white/70 sm:text-[11px]">{t("trust.averageRating")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
