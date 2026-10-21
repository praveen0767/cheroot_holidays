import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/layout/PageHeader";
import PackageCatalogue from "@/components/packages/PackageCatalogue";
import { packages } from "@/data/packages";
import { destinations } from "@/data/destinations";
import { usableDestinationCandidates } from "@/data/destination-candidates";
import Container from "@/components/ui/Container";

import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Holiday Tour Packages & Destinations Catalogue",
  description:
    "Browse curated tour packages and tailor-made travel itineraries across international, domestic, and honeymoon destinations with Cheroot Holidays.",
  alternates: {
    canonical: absoluteUrl("/packages"),
  },
  openGraph: {
    title: "Holiday Tour Packages & Destinations Catalogue | Cheroot Holidays",
    description:
      "Browse curated tour packages and tailor-made travel itineraries across international, domestic, and honeymoon destinations with Cheroot Holidays.",
    url: absoluteUrl("/packages"),
    images: [
      {
        url: "/brand/cheroot-logo.png",
        alt: "Cheroot Holidays Tour Packages",
      },
    ],
  },
};

/**
 * Build combined destination filter options from both active packages
 * and recovered destination candidates.
 */
function buildDestinationOptions() {
  const map = new Map<string, string>();
  for (const d of destinations) {
    map.set(d.slug, d.name);
  }
  for (const c of usableDestinationCandidates) {
    if (!map.has(c.destinationSlug)) {
      map.set(c.destinationSlug, c.countryOrRegion);
    }
  }
  return Array.from(map.entries())
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function CatalogueFallback() {
  return (
    <Container className="py-20 text-center">
      <div
        className="inline-block size-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600"
        aria-label="Loading packages"
        role="status"
      />
    </Container>
  );
}

export default function PackagesPage() {
  const destinationOptions = buildDestinationOptions();

  return (
    <>
      <PageHeader
        eyebrow="Holiday Catalogue"
        title="Thoughtfully planned journeys"
        description="Browse our signature tour packages and explore customisable itineraries across international, domestic and honeymoon destinations."
      />
      <Suspense fallback={<CatalogueFallback />}>
        <PackageCatalogue
          packages={packages}
          candidates={usableDestinationCandidates}
          destinationOptions={destinationOptions}
        />
      </Suspense>
    </>
  );
}
