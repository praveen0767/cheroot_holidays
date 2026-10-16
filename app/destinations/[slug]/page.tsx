import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { destinations } from "@/data/destinations";
import PageHeader from "@/components/layout/PageHeader";
import DetailPlaceholder from "@/components/layout/DetailPlaceholder";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/destinations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const destination = destinations.find((d) => d.slug === slug);
  return { title: destination ? destination.name : "Destination" };
}

export default async function DestinationDetailPage({
  params,
}: PageProps<"/destinations/[slug]">) {
  const { slug } = await params;
  const destination = destinations.find((d) => d.slug === slug);
  if (!destination) notFound();

  return (
    <>
      <PageHeader
        eyebrow={`Destination · ${destination.country}`}
        title={destination.name}
        description={destination.tagline}
      />
      <DetailPlaceholder
        eyebrow="Destination"
        title={destination.name}
        note={`Full ${destination.name} guide — best time to visit, packages and curated itineraries — arrives in Phase 3.`}
      />
    </>
  );
}
