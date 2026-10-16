import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import PlaceholderPage from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = {
  title: "About",
  description: "The Cheroot Holidays story — since 2011.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Since 2011, planning journeys that feel personal"
        description="Our story, our beliefs and the people behind Cheroot Holidays."
      />
      <PlaceholderPage note="The visual origin timeline (2011 → today), trust indicators and team section arrive in Phase 3." />
    </>
  );
}
