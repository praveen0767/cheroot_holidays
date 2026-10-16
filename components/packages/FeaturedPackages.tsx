import Link from "next/link";
import { featuredPackages } from "@/data/packages";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import PackageGrid from "@/components/packages/PackageGrid";

export default function FeaturedPackages() {
  return (
    <section id="featured" className="bg-surface py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Featured experiences"
            title="Journeys worth taking"
            description="Popular itineraries with clear inclusions, honest pricing and room to customise."
          />
          <Link
            href="/packages"
            className="group inline-flex items-center gap-1.5 pb-2 text-sm font-bold text-brand-700 transition hover:text-brand-600"
          >
            View all packages
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <PackageGrid items={featuredPackages} />
      </Container>
    </section>
  );
}
