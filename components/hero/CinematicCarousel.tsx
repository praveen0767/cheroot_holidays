"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import type { TravelPackage } from "@/data/packages";
import { PLACEHOLDER_IMAGE } from "@/data/packages";

function subscribeReducedMotion(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getSnapshot = () =>
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
const getServerSnapshot = () => false;

interface Props {
  packages: TravelPackage[];
}

const SLIDE_DURATION = 6000; // ms

export default function CinematicCarousel({ packages }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getSnapshot,
    getServerSnapshot,
  );

  const total = packages.length;

  const advance = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((cur) => {
      setPrevIndex(cur);
      return (cur + 1) % total;
    });
  }, [total]);

  // Auto-advance
  useEffect(() => {
    if (prefersReducedMotion || total <= 1) return;
    const id = setInterval(advance, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [advance, prefersReducedMotion, total]);

  // Clear prev after transition
  useEffect(() => {
    if (prevIndex === null) return;
    const id = setTimeout(() => setPrevIndex(null), 900);
    return () => clearTimeout(id);
  }, [prevIndex]);

  if (total === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 overflow-hidden"
    >
      {packages.map((pkg, i) => {
        const isActive = i === activeIndex;
        const isPrev = i === prevIndex;
        const src = imageErrors[pkg.slug] ? PLACEHOLDER_IMAGE : pkg.image || PLACEHOLDER_IMAGE;

        if (!isActive && !isPrev) return null;

        return (
          <div
            key={pkg.slug}
            className="absolute inset-0"
            style={{
              transition: prefersReducedMotion
                ? "none"
                : "opacity 0.9s cubic-bezier(0.4,0,0.2,1)",
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 2 : 1,
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-center"
              style={{
                transform: isActive && !prefersReducedMotion
                  ? "scale(1.04)"
                  : "scale(1)",
                transition: isActive
                  ? `transform ${SLIDE_DURATION}ms cubic-bezier(0.25,0.46,0.45,0.94)`
                  : "none",
              }}
              onError={() =>
                setImageErrors((p) => ({ ...p, [pkg.slug]: true }))
              }
            />
          </div>
        );
      })}

      {/* Slide indicator dots — bottom-right */}
      {total > 1 && (
        <div className="absolute bottom-8 right-6 z-10 flex gap-1.5">
          {packages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setPrevIndex(activeIndex);
                setActiveIndex(i);
              }}
              aria-label={`Go to slide ${i + 1}`}
              className={[
                "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                i === activeIndex
                  ? "w-6 bg-white"
                  : "w-1.5 bg-white/40 hover:bg-white/70",
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
