import type { Destination } from "@/data/destinations";
import DestinationCard from "@/components/destinations/DestinationCard";

/**
 * Mobile: horizontal snap row · tablet: 2 col · desktop: 4 col grid.
 */
export default function DestinationGrid({ items }: { items: Destination[] }) {
  return (
    <div className="snap-row mt-8 flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-4">
      {items.map((destination, i) => (
        <div
          key={destination.slug}
          className="w-[68vw] shrink-0 snap-start sm:w-[45vw] md:w-auto"
        >
          <DestinationCard destination={destination} index={i} />
        </div>
      ))}
    </div>
  );
}
