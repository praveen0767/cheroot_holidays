import type { TravelPackage } from "@/data/packages";
import Reveal from "@/components/ui/Reveal";
import PackageCard from "@/components/packages/PackageCard";

/**
 * Mobile: horizontal snap carousel · tablet: 2 col · desktop: 4 col grid.
 */
export default function PackageGrid({ items }: { items: TravelPackage[] }) {
  return (
    <div className="snap-row mt-8 flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-4">
      {items.map((pkg, i) => (
        <Reveal
          key={pkg.slug}
          delay={i * 80}
          className="w-[82vw] shrink-0 snap-start sm:w-[60vw] md:w-auto"
        >
          <PackageCard pkg={pkg} />
        </Reveal>
      ))}
    </div>
  );
}
