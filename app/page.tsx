import Hero from "@/components/hero/Hero";
import DestinationSection from "@/components/destinations/DestinationSection";
import TrustGrid from "@/components/trust/TrustGrid";
import FeaturedPackages from "@/components/packages/FeaturedPackages";
import ServicesStrip from "@/components/services/ServicesStrip";
import TestimonialCarousel from "@/components/testimonials/TestimonialCarousel";
import FinalCTA from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <DestinationSection />
      <TrustGrid />
      <FeaturedPackages />
      <ServicesStrip />
      <TestimonialCarousel />
      <FinalCTA />
    </>
  );
}
