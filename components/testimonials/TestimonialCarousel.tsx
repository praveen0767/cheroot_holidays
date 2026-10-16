"use client";

import { useState } from "react";
import { testimonials } from "@/data/testimonials";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className={cn("size-4", i < rating ? "text-accent" : "text-line")}
        >
          <path d="m10 1.8 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8L10 1.8Z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;
  const active = testimonials[index];

  const move = (dir: -1 | 1) =>
    setIndex((i) => (i + dir + total) % total);

  return (
    <section className="bg-surface-soft py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Stories"
          title="Travellers who trusted us"
          description="Real trips, real reviews — from families, couples and solo explorers."
          align="center"
        />

        <div className="relative mx-auto mt-10 max-w-3xl">
          <figure className="rounded-3xl border border-line/80 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(11,27,51,0.6)] sm:p-9">
            <Stars rating={active.rating} />
            <blockquote className="mt-4 text-lg leading-relaxed font-medium text-ink-900 sm:text-xl">
              “{active.quote}”
            </blockquote>
            <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-ink-900">{active.name}</p>
                <p className="text-sm text-ink-600">{active.location}</p>
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                {active.trip}
              </span>
            </figcaption>
          </figure>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous review"
              className="grid size-10 place-items-center rounded-full border border-line bg-white text-ink-700 transition hover:border-brand-300 hover:text-brand-700"
            >
              <svg viewBox="0 0 20 20" fill="none" className="size-4">
                <path d="M16 10H5m0 0 4-4m-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="flex gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to review ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === index ? "w-7 bg-brand-600" : "w-2 bg-line hover:bg-brand-200",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next review"
              className="grid size-10 place-items-center rounded-full border border-line bg-white text-ink-700 transition hover:border-brand-300 hover:text-brand-700"
            >
              <svg viewBox="0 0 20 20" fill="none" className="size-4">
                <path d="M4 10h11m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
