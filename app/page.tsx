import Hero from "@/components/hero/Hero";
import CategoryDiscovery from "@/components/home/CategoryDiscovery";
import TravelRhythm from "@/components/home/TravelRhythm";
import ScenicJourneyBanner from "@/components/home/ScenicJourneyBanner";
import DestinationSection from "@/components/destinations/DestinationSection";
import FeaturedPackages from "@/components/packages/FeaturedPackages";
import ExperienceSection from "@/components/home/ExperienceSection";
import AdventureFeature from "@/components/home/AdventureFeature";
import TrustGrid from "@/components/trust/TrustGrid";
import VisualJournal from "@/components/home/VisualJournal";
import ServicesStrip from "@/components/services/ServicesStrip";
import PlanningProcess from "@/components/home/PlanningProcess";
import DestinationJourneyStrip from "@/components/home/DestinationJourneyStrip";
import FinalCTA from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <>
      {/* 1. Cinematic Hero with Smart Search & Featured Auto-Rotating Carousel */}
      <Hero />

      {/* 2. Travel Style & Category Discovery (International, Domestic, Honeymoon, Visa, Custom) */}
      <CategoryDiscovery />

      {/* 3. Traveller Persona Discovery — Choose Your Travel Rhythm */}
      <TravelRhythm />

      {/* 4. Scenic Journey Planning Feature ("Choose Your Journey. We handle every detail.") */}
      <ScenicJourneyBanner />

      {/* 4. Destination Collections with Live Counts & Verified Photography */}
      <DestinationSection />

      {/* 5. Featured Verified Package Journeys with Transparent Pricing */}
      <FeaturedPackages />

      {/* 6. Signature Travel Experiences & Style Showcases */}
      <ExperienceSection />

      {/* 7. Adventure & Outdoor Exploration ("Find your next great adventure") */}
      <AdventureFeature />

      {/* 8. Why Cheroot: 4 Core Brand Commitments & Trust Principles */}
      <TrustGrid />

      {/* 9. Cheroot Atlas: Authentic Visual Journal & Moments of Wonder */}
      <VisualJournal />

      {/* 10. Comprehensive Travel Services (Flights, Hotels, Visas, Itineraries) */}
      <ServicesStrip />

      {/* 11. The Cheroot Planning Process (Consultation to Ongoing Support) */}
      <PlanningProcess />

      {/* 12. Destination Journey Line & Editorial Quote */}
      <DestinationJourneyStrip />

      {/* 13. Final Conversion CTA ("Let's plan your next story") */}
      <FinalCTA />
    </>
  );
}
