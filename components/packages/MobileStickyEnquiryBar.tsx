"use client";

import { useEffect, useState, useCallback } from "react";
import { formatINR, cn } from "@/lib/utils";

interface MobileStickyEnquiryBarProps {
  price?: number;
  hasVerifiedPrice: boolean;
}

export default function MobileStickyEnquiryBar({
  price,
  hasVerifiedPrice,
}: MobileStickyEnquiryBarProps) {
  const [isFormInView, setIsFormInView] = useState(false);

  useEffect(() => {
    const formEl = document.getElementById("enquiry-form");
    if (!formEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIsFormInView(entry.isIntersecting);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -20px 0px",
      },
    );

    observer.observe(formEl);
    return () => observer.disconnect();
  }, []);

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
    <aside
      aria-label="Quick trip enquiry action"
      className={cn(
        "fixed bottom-0 inset-x-0 z-40 flex items-center justify-between gap-3 border-t border-line bg-white/95 backdrop-blur-md px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-10px_rgba(11,27,51,0.18)] transition-transform duration-300 lg:hidden",
        isFormInView ? "translate-y-full pointer-events-none" : "translate-y-0",
      )}
    >
      <div className="min-w-0">
        {hasVerifiedPrice && price ? (
          <>
            <p className="text-[11px] font-semibold text-ink-600 uppercase tracking-wider">
              From
            </p>
            <p className="text-base sm:text-lg font-extrabold text-ink-900 leading-tight">
              {formatINR(price)}
            </p>
          </>
        ) : (
          <>
            <p className="text-[11px] font-semibold text-ink-600 uppercase tracking-wider">
              Pricing
            </p>
            <p className="text-sm font-bold text-ink-900 leading-tight">
              Personalised quote
            </p>
          </>
        )}
      </div>

      <a
        href="#enquiry-form"
        onClick={handleClick}
        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-center text-sm font-bold text-white shadow-md hover:bg-brand-700 active:scale-[0.98] transition-all cursor-pointer"
      >
        <span>Enquire Now</span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className="size-4"
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
    </aside>
  );
}
