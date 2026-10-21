"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import type { TravelPackage } from "@/data/packages";
import { PLACEHOLDER_IMAGE } from "@/data/packages";
import Badge from "@/components/ui/Badge";
import { formatINR, cn } from "@/lib/utils";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

interface HeroCarouselProps {
  packages: TravelPackage[];
  className?: string;
}

export default function HeroCarousel({ packages, className }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);
  const totalSlides = packages.length;

  // Safe navigation helpers
  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // 5-second auto rotation with pause on hover/focus and reduced motion
  useEffect(() => {
    if (prefersReducedMotion || isPaused || totalSlides <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion, totalSlides]);

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

  if (totalSlides === 0) return null;

  const currentPkg = packages[activeIndex];

  return (
    <div className={cn("relative w-full select-none", className)}>
      {/* ── Layered Background Card (Visual Depth inspired by edX reference) ── */}
      <div
        aria-hidden="true"
        className="hidden sm:block absolute -top-3.5 -right-3.5 w-full h-full rounded-3xl bg-brand-800/40 border border-white/15 backdrop-blur-sm transform rotate-1.5 scale-[0.985] pointer-events-none transition-all duration-500 shadow-lg"
      />
      <div
        aria-hidden="true"
        className="hidden sm:block absolute -top-1.5 -right-1.5 w-full h-full rounded-3xl bg-brand-800/60 border border-white/20 backdrop-blur-md transform -rotate-0.5 scale-[0.992] pointer-events-none transition-all duration-500 shadow-md"
      />

      {/* ── Main Active Carousel Card ── */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured Holiday Packages"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative z-10 w-full overflow-hidden rounded-3xl bg-brand-900 border border-white/25 shadow-[0_30px_70px_-20px_rgba(7,35,90,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
      >
        <div className="relative h-[440px] sm:h-[480px] md:h-[520px] lg:h-[560px] w-full">
          {/* Slide Background Photography with smooth crossfade */}
          {packages.map((pkg, index) => {
            const isActive = index === activeIndex;
            const imageSrc = imageErrors[pkg.slug]
              ? PLACEHOLDER_IMAGE
              : pkg.image || PLACEHOLDER_IMAGE;

            return (
              <div
                key={pkg.slug}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${totalSlides}: ${pkg.title}`}
                aria-hidden={!isActive}
                className={cn(
                  "absolute inset-0 transition-opacity ease-in-out",
                  prefersReducedMotion ? "duration-0" : "duration-700",
                  isActive
                    ? "opacity-100 z-10 pointer-events-auto"
                    : "opacity-0 z-0 pointer-events-none",
                )}
              >
                <Image
                  src={imageSrc}
                  alt={`${pkg.destination} — ${pkg.title}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 680px"
                  className="object-cover object-center select-none"
                  onError={() =>
                    setImageErrors((prev) => ({ ...prev, [pkg.slug]: true }))
                  }
                />

                {/* Gradients ensuring WCAG AAA legibility */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/65 to-brand-900/25"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-r from-brand-900/90 via-brand-900/40 to-transparent"
                />
              </div>
            );
          })}

          {/* ── Slide Header: Counter & Badge ── */}
          <div className="absolute top-5 inset-x-5 z-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-900/70 px-3 py-1 text-xs font-bold tracking-wider text-brand-200 uppercase backdrop-blur-md ring-1 ring-white/20">
                <span className="size-1.5 rounded-full bg-brand-400 animate-pulse" />
                Featured Pick · {currentPkg.destination}
              </span>
              {currentPkg.badge && (
                <Badge tone="glass" className="text-xs">
                  {currentPkg.badge}
                </Badge>
              )}
            </div>

            {/* Slide Index Counter (e.g. 01 / 05) */}
            <div className="rounded-full bg-brand-900/70 px-3 py-1 text-xs font-bold tracking-wider text-brand-200 backdrop-blur-md ring-1 ring-white/15">
              0{activeIndex + 1} / 0{totalSlides}
            </div>
          </div>

          {/* ── Active Slide Content ── */}
          <div className="relative z-20 flex h-full flex-col justify-end p-5 sm:p-8 md:p-10">
            {/* Title */}
            <h2 className="text-2xl font-extrabold leading-snug text-white sm:text-3xl lg:text-4xl drop-shadow-sm">
              <Link
                href={`/packages/${currentPkg.slug}`}
                className="hover:text-brand-200 transition-colors"
              >
                {currentPkg.title}
              </Link>
            </h2>

            {/* Description */}
            {currentPkg.description && (
              <p className="mt-2.5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-brand-100/90">
                {currentPkg.description}
              </p>
            )}

            {/* Duration & Price Row */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              {typeof currentPkg.nights === "number" && typeof currentPkg.days === "number" && (
                <div className="flex items-center gap-1.5 font-medium text-white/90">
                  <svg viewBox="0 0 20 20" fill="none" className="size-4 text-brand-300" aria-hidden="true">
                    <rect x="3" y="4.5" width="14" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 8.5h14M7 3v3M13 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span>{currentPkg.nights}N · {currentPkg.days}D</span>
                </div>
              )}

              {typeof currentPkg.price === "number" && currentPkg.price > 0 ? (
                <div className="flex items-center gap-1.5 font-medium text-white/90">
                  <span className="text-brand-300 font-semibold">From</span>
                  <span className="text-base font-extrabold text-white">
                    {formatINR(currentPkg.price)}
                  </span>
                  <span className="text-white/70 text-[11px]">per person</span>
                </div>
              ) : (
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-brand-200 backdrop-blur-sm">
                  Tailored quote on enquiry
                </span>
              )}
            </div>

            {/* Bottom Controls Row: Explore CTA + Navigation Controls */}
            <div className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-white/15">
              <Link
                href={`/packages/${currentPkg.slug}`}
                className="group inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_8px_20px_-6px_rgba(47,134,239,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-400 focus-visible:outline-2 focus-visible:outline-white"
              >
                <span>Explore this journey</span>
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                >
                  <path d="M4 10h11m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              {/* Prev / Indicators / Next Navigation Controls */}
              {totalSlides > 1 && (
                <div className="flex items-center gap-1.5">
                  {/* Prev button */}
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="grid size-9 place-items-center rounded-full border border-white/20 bg-brand-900/70 text-white backdrop-blur-md transition hover:bg-brand-700 hover:border-white/40 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-300"
                  >
                    <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
                      <path d="M12.5 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Dot Indicators */}
                  <div className="flex items-center gap-1 px-1">
                    {packages.map((pkg, i) => (
                      <button
                        key={pkg.slug}
                        type="button"
                        onClick={() => goToSlide(i)}
                        aria-label={`Go to slide ${i + 1}: ${pkg.title}`}
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

                  {/* Next button */}
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="grid size-9 place-items-center rounded-full border border-white/20 bg-brand-900/70 text-white backdrop-blur-md transition hover:bg-brand-700 hover:border-white/40 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-300"
                  >
                    <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
                      <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
