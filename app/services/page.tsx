import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { services } from "@/data/services";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Travel Services — Flights, Hotels, Visas & Custom Itineraries",
  description:
    "End-to-end travel infrastructure for holidays: bespoke itinerary planning, competitive flight booking, verified hotel curation, and visa assistance by Cheroot Holidays.",
  alternates: {
    canonical: absoluteUrl("/services"),
  },
  openGraph: {
    title: "Travel Services | Cheroot Holidays",
    description:
      "Flights, hotels, visas, custom itineraries, and 24/7 travel support. Everything your trip needs under one dedicated thread.",
    url: absoluteUrl("/services"),
    images: [
      {
        url: "/brand/cheroot-logo.png",
        alt: "Cheroot Holidays Travel Services",
      },
    ],
  },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Comprehensive Travel Services"
        title="Everything your trip needs, handled"
        description="From bespoke daily itineraries to flight routes, handpicked stays, and visa paperwork — all managed under one single dedicated thread."
      />

      {/* ── Main Services Grid ── */}
      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 80}>
              <div
                id={service.slug}
                className="scroll-mt-28 flex h-full flex-col rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wider text-brand-600 uppercase">
                    Service 0{i + 1}
                  </span>
                  <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                    Cheroot Travel
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-bold text-ink-900">
                  {service.title}
                </h2>

                <p className="mt-2 text-sm font-medium text-brand-700">
                  {service.short}
                </p>

                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  {service.description}
                </p>

                {/* Key Points */}
                <div className="mt-6 border-t border-line/70 pt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-700 mb-2.5">
                    What we manage:
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-ink-600">
                    {service.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2">
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          className="size-4 shrink-0 text-brand-600"
                          aria-hidden="true"
                        >
                          <path
                            d="M4 10.5l4 4 8-8"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA */}
                <div className="mt-auto pt-6">
                  <Link
                    href={`/contact?service=${service.slug}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-50 px-4 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-600 hover:text-white"
                  >
                    <span>Enquire for {service.title}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── Why Book Travel Infrastructure with Cheroot? ── */}
        <section className="mt-16 sm:mt-20 rounded-3xl border border-brand-100 bg-brand-50/60 p-8 sm:p-12">
          <div className="max-w-3xl">
            <span className="text-xs font-bold tracking-widest text-brand-700 uppercase">
              The Cheroot Advantage
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-ink-900 sm:text-3xl">
              One dedicated specialist, zero ticket queues
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-600">
              Unlike generic online portals where booking changes require endless hold times, our specialists coordinate your flights, transfers, stays, and visas directly. If a flight changes or an itinerary needs adjusting, your travel planner is already on it.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-600"
              >
                Plan your journey with a specialist
              </Link>
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-ink-700 transition hover:bg-surface-soft"
              >
                Browse Holiday Packages
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}
