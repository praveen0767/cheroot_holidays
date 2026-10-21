"use client";

import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/LanguageContext";

function subscribeReducedMotion(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

const getReducedMotionSnapshot = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const getReducedMotionServerSnapshot = () => false;

interface BackToTopProps {
  threshold?: number;
  labelEn?: string;
  labelTa?: string;
}

export default function BackToTop({
  threshold = 420,
  labelEn = "Back to top",
  labelTa = "மேலே செல்ல",
}: BackToTopProps) {
  const { locale } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  useEffect(() => {
    let ticking = false;

    const checkScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsVisible(scrollY > threshold);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkScroll);
        ticking = true;
      }
    };

    // Initial check
    checkScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [prefersReducedMotion]);

  const isTa = locale === "ta";

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={isTa ? labelTa : labelEn}
      title={isTa ? labelTa : labelEn}
      className={cn(
        "group fixed z-40 flex items-center gap-2 rounded-full border border-white/60 bg-brand-900/90 px-3.5 py-2.5 text-white shadow-[0_12px_32px_-8px_rgba(7,35,90,0.6)] backdrop-blur-md transition-all duration-300 hover:bg-brand-700 hover:border-white hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-400 cursor-pointer",
        "bottom-6 right-4 sm:bottom-8 sm:right-8",
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-6 opacity-0 pointer-events-none",
      )}
    >
      {/* Compass / Arrow Motif */}
      <span className="grid size-6 place-items-center rounded-full bg-white/15 text-brand-200 transition-colors group-hover:bg-brand-500 group-hover:text-white">
        <svg
          viewBox="0 0 20 20"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5"
          aria-hidden="true"
        >
          <path d="M10 16V4m0 0-4.5 4.5M10 4l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      {/* Label (compact, visible on larger screens) */}
      <span className="hidden pr-1 text-xs font-bold tracking-wide sm:inline">
        {isTa ? "மேலே" : "Top"}
      </span>
    </button>
  );
}
