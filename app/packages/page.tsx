import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import PlaceholderPage from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = {
  title: "Packages",
  description: "Curated travel packages by Cheroot Holidays.",
};

export default function PackagesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Packages"
        title="Thoughtfully planned journeys"
        description="Browse, filter and compare curated itineraries with clear inclusions."
      />
      <PlaceholderPage note="The package catalogue with category filters, search-state handling and detail pages arrives in Phase 3." />
    </>
  );
}
