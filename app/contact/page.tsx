import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import PlaceholderPage from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Plan your journey with Cheroot Holidays.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Plan your journey"
        description="Where are you going, when, and what kind of trip? We'll take it from there."
      />
      <PlaceholderPage note="The full conversion form — destination, dates, travellers, budget — plus the office selector for Chennai, Coimbatore, Erode and Tirupur arrives in Phase 3." />
    </>
  );
}
