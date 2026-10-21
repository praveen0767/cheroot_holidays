import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { packages } from "@/data/packages";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import PackageCard from "@/components/packages/PackageCard";
import Reveal from "@/components/ui/Reveal";
import PackageEnquiryForm from "@/components/packages/PackageEnquiryForm";
import PackageHeroCTA from "@/components/packages/PackageHeroCTA";
import MobileStickyEnquiryBar from "@/components/packages/MobileStickyEnquiryBar";
import { formatINR } from "@/lib/utils";

import { absoluteUrl, getPackageJsonLd, getBreadcrumbJsonLd, getFAQPageJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/packages/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const pkg = packages.find((p) => p.slug === slug);
  if (!pkg) return { title: "Package not found" };

  const title = `${pkg.title} | ${pkg.destination} Tour Package`;
  const description =
    pkg.description ??
    `Explore ${pkg.destination} with Cheroot Holidays — signature ${pkg.category} tour package. Enquire for tailored pricing and itinerary.`;

  const canonicalUrl = absoluteUrl(`/packages/${pkg.slug}`);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: pkg.image.startsWith("http") ? pkg.image : absoluteUrl(pkg.image),
          alt: `${pkg.destination} — ${pkg.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [pkg.image.startsWith("http") ? pkg.image : absoluteUrl(pkg.image)],
    },
  };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Breadcrumb({
  destination,
  destinationSlug,
  title,
}: {
  destination: string;
  destinationSlug: string;
  title: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className="py-3 sm:py-3.5">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-ink-600">
        <li>
          <Link href="/" className="hover:text-brand-700 transition-colors">
            Home
          </Link>
        </li>
        <li aria-hidden="true" className="text-ink-400">›</li>
        <li>
          <Link href="/packages" className="hover:text-brand-700 transition-colors">
            Packages
          </Link>
        </li>
        <li aria-hidden="true" className="text-ink-400">›</li>
        <li>
          <Link
            href={`/packages?destination=${destinationSlug}`}
            className="hover:text-brand-700 transition-colors"
          >
            {destination}
          </Link>
        </li>
        <li aria-hidden="true" className="text-ink-400">›</li>
        <li
          className="truncate max-w-[220px] sm:max-w-none font-semibold text-ink-900"
          aria-current="page"
        >
          {title}
        </li>
      </ol>
    </nav>
  );
}

function InfoChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-line bg-surface-soft px-4 py-3">
      <span className="text-brand-500">{icon}</span>
      <span className="text-sm font-medium text-ink-700">{label}</span>
    </div>
  );
}

const CalendarIcon = (
  <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
    <rect x="3" y="4.5" width="14" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 8.5h14M7 3v3M13 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const StarIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="size-5 text-accent" aria-hidden="true">
    <path d="m10 1.8 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8L10 1.8Z" />
  </svg>
);

const GlobeIcon = (
  <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 3c0 0-3 2.5-3 7s3 7 3 7M10 3c0 0 3 2.5 3 7s-3 7-3 7M3 10h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default async function PackageDetailPage({
  params,
}: PageProps<"/packages/[slug]">) {
  const { slug } = await params;
  const pkg = packages.find((p) => p.slug === slug);
  if (!pkg) notFound();

  const hasVerifiedPrice =
    typeof pkg.price === "number" && pkg.price > 0;
  const hasVerifiedRating =
    typeof pkg.rating === "number" &&
    pkg.rating > 0 &&
    typeof pkg.reviews === "number" &&
    pkg.reviews > 0;
  const hasDuration =
    typeof pkg.nights === "number" && typeof pkg.days === "number";
  const hasHighlights =
    Array.isArray(pkg.highlights) && pkg.highlights.length > 0;

  const categoryLabel: Record<string, string> = {
    international: "International",
    domestic: "Domestic",
    honeymoon: "Honeymoon",
  };

  // Related: same destination or same category, backfilled with other packages to ensure 3 recommendations
  const primaryRelated = packages.filter(
    (p) =>
      p.slug !== pkg.slug &&
      (p.destinationSlug === pkg.destinationSlug ||
        p.category === pkg.category),
  );
  const otherPackages = packages.filter(
    (p) => p.slug !== pkg.slug && !primaryRelated.some((r) => r.slug === p.slug),
  );
  const related = [...primaryRelated, ...otherPackages].slice(0, 3);

  const packageJsonLd = getPackageJsonLd(pkg);
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Packages", path: "/packages" },
    { name: pkg.destination, path: `/packages?destination=${pkg.destinationSlug}` },
    { name: pkg.title, path: `/packages/${pkg.slug}` },
  ]);

  const faqJsonLd = getFAQPageJsonLd([
    {
      question: "Can I customise the activities and hotels in this package?",
      answer:
        "Absolutely. Every Cheroot package is a starting framework. You can upgrade hotel categories, add private transfers, extend your stay, or swap out sightseeing.",
    },
    {
      question: "How does the quotation and booking process work?",
      answer:
        "Submit the enquiry form on this page. Our destination planner will reach out with confirmed rates for your specific dates, passenger count, and complete itinerary details.",
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(packageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Breadcrumb Bar (clears fixed header h-16/h-20 with separate background and border) ── */}
      <div className="pt-16 md:pt-20 bg-surface-soft border-b border-line/60">
        <Container>
          <Breadcrumb
            destination={pkg.destination}
            destinationSlug={pkg.destinationSlug}
            title={pkg.title}
          />
        </Container>
      </div>

      {/* ── Hero image & Quick Action Banner ─────────────────────── */}
      <div className="relative h-[360px] w-full overflow-hidden bg-brand-900 sm:h-[400px] md:h-[440px] lg:h-[480px]">
        <Image
          src={pkg.image}
          alt={`${pkg.destination} — ${pkg.title}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Multi-stop gradient: heavy at bottom for title & CTA legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/95 via-brand-950/50 to-black/25" />

        <Container className="relative h-full flex flex-col justify-end pb-6 sm:pb-8 lg:pb-10">
          <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-end lg:justify-between">
            {/* Title & key indicators */}
            <div className="max-w-2xl">
              {pkg.badge && (
                <div className="mb-2 sm:mb-2.5">
                  <Badge tone="glass">{pkg.badge}</Badge>
                </div>
              )}
              <p className="text-xs sm:text-sm font-bold tracking-widest text-brand-200 uppercase">
                {pkg.destination} · {categoryLabel[pkg.category] || "Tour Package"}
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl md:text-4xl lg:text-5xl tracking-tight drop-shadow-sm">
                {pkg.title}
              </h1>
              {hasDuration && (
                <p className="mt-2 text-xs sm:text-sm font-medium text-white/85">
                  {pkg.nights} Nights · {pkg.days} Days
                </p>
              )}
            </div>

            {/* Prominent Hero CTA & verified price banner — visible immediately in initial viewport */}
            <div className="flex flex-wrap items-center justify-between sm:justify-start gap-4 rounded-2xl bg-brand-950/70 p-3.5 sm:p-4 backdrop-blur-md ring-1 ring-white/15 lg:bg-white/10 lg:backdrop-blur-lg">
              <div className="min-w-0 pr-2">
                {hasVerifiedPrice ? (
                  <>
                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-brand-200/80">
                      Starting from
                    </p>
                    <p className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      {formatINR(pkg.price!)}
                    </p>
                    <p className="text-[10px] text-white/60">
                      per person
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-brand-200/80">
                      Pricing
                    </p>
                    <p className="text-base sm:text-lg font-bold text-white">
                      Custom Quote
                    </p>
                    <p className="text-[10px] text-white/60">
                      on enquiry
                    </p>
                  </>
                )}
              </div>

              <PackageHeroCTA label="Enquire About This Trip" />
            </div>
          </div>
        </Container>
      </div>

      {/* ── Main content ─────────────────────────────────────────── */}
      <Container className="py-10">
        <div className="grid gap-8 lg:grid-cols-3">

          {/* Left / main column */}
          <div className="space-y-8 lg:col-span-2">

            {/* Quick info chips */}
            <div className="flex flex-wrap gap-3">
              {hasDuration && (
                <InfoChip
                  icon={CalendarIcon}
                  label={`${pkg.nights} Nights · ${pkg.days} Days`}
                />
              )}
              {hasVerifiedRating && (
                <InfoChip
                  icon={StarIcon}
                  label={`${pkg.rating!.toFixed(1)} / 5 · ${pkg.reviews!.toLocaleString()} reviews`}
                />
              )}
              <InfoChip
                icon={GlobeIcon}
                label={categoryLabel[pkg.category]}
              />
            </div>

            {/* Description */}
            {pkg.description && (
              <section>
                <h2 className="text-xl font-bold text-ink-900">
                  About this journey
                </h2>
                <p className="mt-3 leading-relaxed text-ink-600">
                  {pkg.description}
                </p>
              </section>
            )}

            {/* Highlights */}
            {hasHighlights && (
              <section>
                <h2 className="text-xl font-bold text-ink-900">Highlights</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {pkg.highlights!.map((h) => (
                    <li
                      key={h}
                      className="flex items-center gap-2 rounded-xl border border-brand-100 bg-brand-50 px-3 py-2 text-sm font-medium text-brand-800"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        className="size-4 shrink-0 text-brand-500"
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
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Gallery (if available) */}
            {Array.isArray(pkg.gallery) && pkg.gallery.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-4">
                  Photo Highlights
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {pkg.gallery.map((img, idx) => (
                    <div
                      key={img}
                      className="relative aspect-4/3 overflow-hidden rounded-2xl border border-line bg-surface-soft"
                    >
                      <Image
                        src={img}
                        alt={`${pkg.title} highlight ${idx + 1}`}
                        fill
                        sizes="(max-width: 640px) 45vw, 25vw"
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Inclusions & Exclusions */}
            <section className="grid gap-4 sm:grid-cols-2 rounded-3xl border border-line bg-white p-6">
              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-ink-900">
                  <span className="grid size-6 place-items-center rounded-full bg-emerald-100 text-emerald-700 text-xs">
                    ✓
                  </span>
                  Standard Inclusions
                </h3>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm text-ink-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Handpicked verified hotel accommodations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Daily breakfast at the hotel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Airport transfers & scheduled sightseeing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Dedicated travel coordinator support</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-ink-900">
                  <span className="grid size-6 place-items-center rounded-full bg-slate-100 text-slate-700 text-xs">
                    ✕
                  </span>
                  Exclusions
                </h3>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm text-ink-600">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400">✕</span>
                    <span>International / domestic flights (can be added)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400">✕</span>
                    <span>Visa fees and mandatory processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400">✕</span>
                    <span>Personal laundry, tips, and optional activities</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Itinerary — honest message, no fabricated days */}
            <section className="rounded-3xl border border-line bg-surface-soft p-6">
              <h2 className="text-xl font-bold text-ink-900">Itinerary</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                A detailed day-by-day itinerary is available on request. Our
                travel team will share the latest programme, hotel options, and
                inclusions tailored to your travel dates and group size.
              </p>
              <p className="mt-3 text-sm font-semibold text-brand-700">
                Request the latest itinerary and quotation from our travel team
              </p>
            </section>

            {/* Frequently Asked Questions */}
            <section className="rounded-3xl border border-line bg-white p-6 space-y-4">
              <h2 className="text-xl font-bold text-ink-900">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                <div className="rounded-2xl border border-line/70 bg-surface-soft p-4">
                  <h3 className="text-sm font-bold text-ink-900">
                    Can I customise the activities and hotels in this package?
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-ink-600 leading-relaxed">
                    Absolutely. Every Cheroot package is a starting framework. You can upgrade hotel categories, add private transfers, extend your stay, or swap out sightseeing.
                  </p>
                </div>
                <div className="rounded-2xl border border-line/70 bg-surface-soft p-4">
                  <h3 className="text-sm font-bold text-ink-900">
                    How does the quotation and booking process work?
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-ink-600 leading-relaxed">
                    Submit the enquiry form on this page. Our destination planner will reach out with confirmed rates for your specific dates, passenger count, and complete itinerary details.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right / sidebar — sticky on desktop so form stays in view */}
          <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">

            {/* Price card */}
            <div className="rounded-3xl border border-line bg-surface-soft p-6">
              {hasVerifiedPrice ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest text-ink-600">
                    Starting from
                  </p>
                  <p className="mt-1 text-4xl font-extrabold text-ink-900 tracking-tight">
                    {formatINR(pkg.price!)}
                  </p>
                  <p className="mt-1 text-xs text-ink-600">
                    per person &middot; subject to availability
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold uppercase tracking-widest text-ink-600">
                    Pricing
                  </p>
                  <p className="mt-1 text-lg font-bold text-ink-900">
                    Personalised quote
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    Rates vary by dates, group size, and hotel selection.
                  </p>
                </>
              )}
            </div>

            <PackageEnquiryForm pkg={pkg} />
          </div>
        </div>

        {/* ── Related packages ─────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-16 pb-24 lg:pb-0" aria-labelledby="related-heading">
            <h2
              id="related-heading"
              className="text-2xl font-bold text-ink-900"
            >
              You might also like
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rp, i) => (
                <Reveal key={rp.slug} delay={i * 80}>
                  <PackageCard pkg={rp} className="h-full" />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </Container>

      {/* ── Mobile sticky CTA bar ─────────────────────────────────────
           Visible only on mobile/tablet (hidden on lg+). Auto-hides when
           the enquiry form is in view so inputs and submit are never obscured.
      ─────────────────────────────────────────────────────────────── */}
      <MobileStickyEnquiryBar
        price={pkg.price}
        hasVerifiedPrice={hasVerifiedPrice}
      />
    </>
  );
}


