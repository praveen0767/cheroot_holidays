import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { OFFICES } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Cheroot Holidays — Explore · Experience · Enjoy",
  description:
    "Learn about Cheroot Holidays. Since 2011, crafting thoughtful holiday itineraries, verified stays, and human-first travel experiences across domestic and international destinations.",
  alternates: {
    canonical: absoluteUrl("/about"),
  },
  openGraph: {
    title: "About Cheroot Holidays — Our Story & Philosophy",
    description:
      "Since 2011, planning holidays that feel truly personal. Transparent pricing, verified stays, and dedicated travel support.",
    url: absoluteUrl("/about"),
    images: [
      {
        url: "/brand/cheroot-logo.png",
        alt: "Cheroot Holidays — Explore · Experience · Enjoy",
      },
    ],
  },
};

const PILLARS = [
  {
    title: "Pace Over Checklists",
    description:
      "Travel is not about racing through 20 sights in a weekend. We build itineraries that breathe — giving you time to absorb the morning mist in Munnar, watch a sunset in Uluwatu, or linger over local street food in Bangkok.",
  },
  {
    title: "Transparent & Honest Pricing",
    description:
      "We quote verified inclusions with total clarity. No inflated hidden charges, surprise mandatory fees, or bait-and-switch tactics. You always know exactly what your holiday costs before you confirm.",
  },
  {
    title: "Verified Stays & Local Logistics",
    description:
      "We partner with tested hotels, trusted local drivers, and verified excursion providers so your vacation unfolds without frustrating delays or substandard accommodations.",
  },
  {
    title: "Direct Human Travel Assistance",
    description:
      "When you plan with Cheroot Holidays, you speak with a real human who knows your itinerary inside out. If a flight gets delayed or you wish to adjust an activity, your specialist is just a message away.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Story & Philosophy"
        title="Planning journeys that feel truly personal"
        description="Since 2011, helping travellers explore unforgettable destinations with thoughtful itineraries, verified stays, and authentic care."
      />

      <Container className="py-12 sm:py-16 lg:py-20 space-y-16 sm:space-y-24">
        {/* ── Section 1: The Cheroot Story ── */}
        <section className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-5 text-ink-700 leading-relaxed text-base sm:text-lg">
            <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
              Founded in 2011
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink-900 leading-tight">
              A travel brand born from the love of real exploration
            </h2>
            <p>
              Cheroot Holidays was established with a straightforward conviction: travel planning should feel reassuring, inspiring, and completely honest. We set out to replace the cookie-cutter mass packages common in the travel industry with carefully curated journeys tailored to what each traveller actually wants to experience.
            </p>
            <p className="text-sm sm:text-base text-ink-600">
              Whether you are planning a tranquil backwater retreat in Kerala, a romantic honeymoon over the turquoise shallows of the Maldives, an adventurous dune safari in Dubai, or a custom journey across Southeast Asia, we ensure every detail is handled with precision.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-brand-100 bg-surface-soft p-8 shadow-sm">
              <span className="text-xs font-bold tracking-wider text-brand-600 uppercase">
                Brand Promise
              </span>
              <h3 className="mt-2 text-2xl font-extrabold text-brand-900">
                Explore · Experience · Enjoy
              </h3>
              <p className="mt-3 text-sm text-ink-600 leading-relaxed">
                Three words that define our service standard. We craft the plan, coordinate the logistics, and ensure your only responsibility is to enjoy the journey.
              </p>
              <div className="mt-6 pt-6 border-t border-line">
                <Link
                  href="/packages"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800 transition"
                >
                  Explore signature tour packages →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: Four Core Pillars ── */}
        <section aria-labelledby="pillars-heading">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
              How We Work
            </span>
            <h2
              id="pillars-heading"
              className="mt-2 text-2xl sm:text-3xl font-extrabold text-ink-900"
            >
              Four principles behind every itinerary
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <div className="flex h-full flex-col rounded-3xl border border-line bg-white p-6 shadow-sm hover:border-brand-200 hover:shadow-md transition">
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                    Pillar 0{i + 1}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-ink-900">
                    {p.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-600">
                    {p.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Section 3: Regional Coordination Centers ── */}
        <section className="rounded-3xl border border-line bg-white p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl">
            <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
              Regional Touchpoints
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-ink-900">
              Customer coordination across Tamil Nadu
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-600">
              Our travel specialists assist travellers across Tamil Nadu and South India with personalized holiday planning and direct consultations.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {OFFICES.map((off) => (
                <div
                  key={off.city}
                  className="rounded-2xl border border-line bg-surface-soft p-4 text-center"
                >
                  <p className="text-base font-bold text-ink-900">{off.city}</p>
                  <p className="text-xs text-ink-600 mt-0.5">{off.region}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-line flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-600"
              >
                Plan your holiday with us
              </Link>
              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-ink-700 transition hover:bg-surface-soft"
              >
                View destinations
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}
