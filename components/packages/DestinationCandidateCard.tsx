"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { DestinationCandidate } from "@/data/destination-candidates";
import Badge from "@/components/ui/Badge";
import { CONTACT } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function DestinationCandidateCard({
  candidate,
  className,
}: {
  candidate: DestinationCandidate;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = imgError ? "/brand/placeholder-package.svg" : candidate.image;

  const categoryLabel: Record<string, string> = {
    international: "International",
    domestic: "Domestic",
    honeymoon: "Honeymoon",
  };

  const waMessage = encodeURIComponent(
    `Hello Cheroot Holidays! I am interested in planning a trip to ${candidate.destination}. Please share quotation and itinerary details.`,
  );

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-line/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_28px_60px_-38px_rgba(11,27,51,0.7)]",
        className,
      )}
    >
      {/* ── Image area ─────────────────────────────────────────────── */}
      <div className="relative aspect-4/3 overflow-hidden bg-brand-900/10">
        <Image
          src={imageSrc}
          alt={`${candidate.destination} — ${candidate.title}`}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/40 via-transparent to-transparent" />

        <div className="absolute top-3 left-3">
          <Badge tone="glass">Custom Trip</Badge>
        </div>

        <div className="absolute top-3 right-3">
          <span className="rounded-full bg-brand-900/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
            {categoryLabel[candidate.category] ?? "Custom"}
          </span>
        </div>
      </div>

      {/* ── Card body ──────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs font-semibold tracking-wider text-brand-600 uppercase">
          {candidate.destination}
        </p>
        <h3 className="mt-1 text-base sm:text-lg font-bold leading-snug text-ink-900 line-clamp-2">
          {candidate.title}
        </h3>

        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-600 line-clamp-3">
          {candidate.description}
        </p>

        {/* ── Pricing & CTA row ────────────────────────────────────── */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2.5 pt-4 border-t border-line/60">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-brand-700">Personalised quote</p>
            <p className="text-[11px] text-ink-600 truncate">On request</p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <a
              href={`${CONTACT.whatsapp}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp enquiry for ${candidate.destination}`}
              className="grid size-8 place-items-center rounded-full bg-[#25D366]/15 text-[#1ebe5d] transition hover:bg-[#25D366] hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347Z" />
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.86.506 3.601 1.385 5.098L2 22l5.047-1.373A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Zm0 18a7.963 7.963 0 0 1-4.274-1.239l-.307-.183-3 .817.832-2.942-.2-.318A7.966 7.966 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8Z" />
              </svg>
            </a>

            <Link
              href={candidate.enquiryUrl}
              className="group/cta inline-flex items-center gap-1 rounded-full bg-brand-700 px-3 py-1.5 text-xs font-bold whitespace-nowrap text-white transition-all duration-200 hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-brand-500"
            >
              Request Quote
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="size-3.5 transition-transform group-hover/cta:translate-x-0.5"
              >
                <path
                  d="M4 10h11m0 0-4-4m4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
