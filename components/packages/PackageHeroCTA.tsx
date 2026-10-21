"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";

interface PackageHeroCTAProps {
  label?: string;
  className?: string;
}

export default function PackageHeroCTA({
  label = "Enquire About This Trip",
  className,
}: PackageHeroCTAProps) {
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("enquiry-form");
    if (target) {
      const isReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      target.scrollIntoView({
        behavior: isReduced ? "auto" : "smooth",
        block: "start",
      });

      // Accessible focus placement after scroll
      const input = target.querySelector<HTMLInputElement>(
        "input#enq-phone, input#enq-name",
      );
      if (input) {
        setTimeout(
          () => {
            input.focus({ preventScroll: true });
          },
          isReduced ? 50 : 380,
        );
      }
    }
  }, []);

  return (
    <a
      href="#enquiry-form"
      onClick={handleClick}
      aria-label="Jump to trip enquiry and callback form"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-brand-950/20 transition-all duration-200 hover:bg-brand-400 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer",
        className,
      )}
    >
      <span>{label}</span>
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
        aria-hidden="true"
      >
        <path
          d="M4.167 10h11.666m-4.166-4.167L15.833 10l-4.166 4.167"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
