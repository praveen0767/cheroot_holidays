import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { packages } from "@/data/packages";
import PageHeader from "@/components/layout/PageHeader";
import DetailPlaceholder from "@/components/layout/DetailPlaceholder";

export function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/packages/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const pkg = packages.find((p) => p.slug === slug);
  return { title: pkg ? pkg.title : "Package" };
}

export default async function PackageDetailPage({
  params,
}: PageProps<"/packages/[slug]">) {
  const { slug } = await params;
  const pkg = packages.find((p) => p.slug === slug);
  if (!pkg) notFound();

  return (
    <>
      <PageHeader
        eyebrow={`Package · ${pkg.nights}N / ${pkg.days}D`}
        title={pkg.title}
        description={`Explore ${pkg.destination} with ${pkg.highlights.join(", ")}.`}
      />
      <DetailPlaceholder
        eyebrow="Package"
        title={pkg.title}
        note="Full itinerary, inclusions, pricing table and enquiry form arrive in Phase 3."
      />
    </>
  );
}
