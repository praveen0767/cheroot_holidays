import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { destinations } from "@/data/destinations";
import { getPackagesByDestination } from "@/data/packages";
import { CONTACT } from "@/lib/constants";
import PageHeader from "@/components/layout/PageHeader";
import Container from "@/components/ui/Container";
import PackageCard from "@/components/packages/PackageCard";
import Reveal from "@/components/ui/Reveal";

import { absoluteUrl, getDestinationJsonLd, getBreadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/destinations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const destination = destinations.find((d) => d.slug === slug);
  if (!destination) return { title: "Destination not found" };

  const title = `${destination.name}, ${destination.country} Holidays & Tour Packages`;
  const description = `${destination.tagline} — Explore curated holiday packages and tailor-made travel itineraries in ${destination.name} by Cheroot Holidays.`;
  const canonicalUrl = absoluteUrl(`/destinations/${destination.slug}`);

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
          url: destination.image.startsWith("http")
            ? destination.image
            : absoluteUrl(destination.image),
          alt: `${destination.name}, ${destination.country}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        destination.image.startsWith("http")
          ? destination.image
          : absoluteUrl(destination.image),
      ],
    },
  };
}

export default async function DestinationDetailPage({
  params,
}: PageProps<"/destinations/[slug]">) {
  const { slug } = await params;
  const destination = destinations.find((d) => d.slug === slug);
  if (!destination) notFound();

  const destinationPackages = getPackagesByDestination(destination.slug);

  const destinationJsonLd = getDestinationJsonLd(destination);
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Destinations", path: "/destinations" },
    { name: destination.name, path: `/destinations/${destination.slug}` },
  ]);

  const waMessage = encodeURIComponent(
    `Hello Cheroot Holidays! I am planning a trip to ${destination.name} (${destination.country}). Please share package options and quotation.`,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <PageHeader
        eyebrow={`Destination · ${destination.country}`}
        title={destination.name}
        description={destination.tagline}
      />

      <Container className="py-12 sm:py-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-ink-600">
            <li>
              <Link href="/" className="hover:text-brand-700 transition">
                Home
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link href="/destinations" className="hover:text-brand-700 transition">
                Destinations
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li className="font-semibold text-ink-900" aria-current="page">
              {destination.name}
            </li>
          </ol>
        </nav>

        {/* Packages section */}
        <section aria-labelledby="packages-heading">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <h2 id="packages-heading" className="text-2xl font-bold text-ink-900 sm:text-3xl">
                Packages in {destination.name}
              </h2>
              <p className="mt-2 text-sm text-ink-600">
                {destinationPackages.length > 0
                  ? `Showing ${destinationPackages.length} curated package${destinationPackages.length === 1 ? "" : "s"}.`
                  : "Custom itineraries available on request."}
              </p>
            </div>
            {destinationPackages.length > 0 && (
              <Link
                href={`/packages?destination=${destination.slug}`}
                className="text-sm font-semibold text-brand-700 hover:text-brand-800 transition"
              >
                View in catalogue →
              </Link>
            )}
          </div>

          {destinationPackages.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destinationPackages.map((pkg, i) => (
                <Reveal key={pkg.slug} delay={i * 80}>
                  <PackageCard pkg={pkg} className="h-full" />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-line bg-surface-soft p-8 text-center sm:p-12">
              <h3 className="text-lg font-bold text-ink-900">
                Tailor-made itineraries for {destination.name}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">
                We craft personalised holiday experiences for {destination.name} based on your travel dates, budget, and group size.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a
                  href={`${CONTACT.whatsapp}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1ebe5d]"
                >
                  Enquire via WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
                >
                  Contact our specialists
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Custom Enquiry Callout */}
        <section className="mt-16 rounded-3xl border border-brand-100 bg-brand-50/60 p-8 sm:p-10">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              Looking for a custom {destination.name} holiday?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Whether you need private transfers, honeymoon surprises, or multi-city combinations, our team will design an itinerary tailored just for you.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href={`${CONTACT.whatsapp}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-600"
              >
                Request a quote for {destination.name}
              </a>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}
