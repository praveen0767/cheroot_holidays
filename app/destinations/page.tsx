import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import PlaceholderPage from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = {
  title: "Destinations",
  description: "International, domestic and honeymoon destinations by Cheroot Holidays.",
};

export default function DestinationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Destinations"
        title="Where will you go next?"
        description="International, domestic and honeymoon destinations — explore the full collection soon."
      />
      <PlaceholderPage note="The full destination explorer — international, domestic and honeymoon categories with filters — arrives in Phase 3." />
    </>
  );
}
