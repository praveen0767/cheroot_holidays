import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services } from "@/data/services";
import PageHeader from "@/components/layout/PageHeader";
import DetailPlaceholder from "@/components/layout/DetailPlaceholder";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  return { title: service ? service.title : "Service" };
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Service"
        title={service.title}
        description={service.short}
      />
      <DetailPlaceholder
        eyebrow="Service"
        title={service.title}
        description={service.description}
        note="Service detail layout with related destinations and CTAs arrives in Phase 3."
      />
    </>
  );
}
