import Link from "next/link";
import { trendingDestinations } from "@/data/destinations";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import DestinationGrid from "@/components/destinations/DestinationGrid";

export default function DestinationSection() {
  return (
    <section className="bg-surface py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Trending now"
            title="Where travellers are going"
            description="Handpicked destinations our travellers are loving this season."
          />
          <Link
            href="/destinations"
            className="group inline-flex items-center gap-1.5 pb-2 text-sm font-bold text-brand-700 transition hover:text-brand-600"
          >
            View all destinations
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <DestinationGrid items={trendingDestinations} />
      </Container>
    </section>
  );
}
