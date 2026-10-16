import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import PlaceholderPage from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = {
  title: "Services",
  description: "Flights, hotels, visas, custom itineraries and travel support.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Travel infrastructure, not a checklist"
        description="Flights, hotels, visa assistance, custom itineraries and human support."
      />
      <PlaceholderPage note="Individual service pages with visuals, details and related destinations arrive in Phase 3." />
    </>
  );
}
