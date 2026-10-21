import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import Container from "@/components/ui/Container";
import DestinationCard from "@/components/destinations/DestinationCard";
import { destinations } from "@/data/destinations";

import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Destinations — International, Domestic & Honeymoon Holidays",
  description:
    "Explore curated holiday destinations across India and the globe. Handcrafted travel itineraries, luxury resorts, and bespoke holiday packages by Cheroot Holidays.",
  alternates: {
    canonical: absoluteUrl("/destinations"),
  },
  openGraph: {
    title: "Holiday Destinations | Cheroot Holidays",
    description:
      "Explore curated holiday destinations across India and the globe. Handcrafted travel itineraries by Cheroot Holidays.",
    url: absoluteUrl("/destinations"),
    images: [
      {
        url: "/brand/cheroot-logo.png",
        alt: "Cheroot Holidays Destinations",
      },
    ],
  },
};

export default function DestinationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Destinations"
        title="Where will you go next?"
        description="Explore curated international, domestic and honeymoon holiday destinations with personalised itineraries."
      />
      <Container className="py-12 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination, i) => (
            <DestinationCard
              key={destination.slug}
              destination={destination}
              index={i}
            />
          ))}
        </div>
      </Container>
    </>
  );
}
