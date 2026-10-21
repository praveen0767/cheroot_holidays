import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/data/destinations";
import Reveal from "@/components/ui/Reveal";
import { formatINR } from "@/lib/utils";

/**
 * Visual destination tile. Desktop hover: image scale + gradient deepen +
 * metadata slides up + arrow translate. Mobile: tap (metadata always visible).
 */
export default function DestinationCard({
  destination,
  index = 0,
}: {
  destination: Destination;
  index?: number;
}) {
  return (
    <Reveal delay={index * 80}>
      <Link
        href={`/destinations/${destination.slug}`}
        className="group relative block aspect-4/5 overflow-hidden rounded-3xl ring-1 ring-line/70 md:aspect-3/4"
      >
        <Image
          src={destination.image}
          alt={`${destination.name}, ${destination.country}`}
          fill
          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/85 via-brand-900/15 to-transparent transition-opacity duration-300 group-hover:from-brand-900/95" />

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <p className="text-[11px] font-bold tracking-[0.16em] text-brand-200/90 uppercase">
            {destination.country}
          </p>
          <h3 className="text-xl font-bold text-white sm:text-2xl">
            {destination.name}
          </h3>

          {/* metadata slides up on hover / always readable on touch */}
          <div className="translate-y-1 space-y-2 opacity-95 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:max-h-0 md:translate-y-3 md:overflow-hidden md:opacity-0 md:group-hover:max-h-32 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <p className="text-sm text-brand-100/90">{destination.tagline}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/90">
                {typeof destination.fromPrice === "number" && destination.fromPrice > 0 ? (
                  <>
                    From{" "}
                    <strong className="font-bold">{formatINR(destination.fromPrice)}</strong>
                  </>
                ) : (
                  <span className="font-medium">Enquire for quote</span>
                )}
              </span>
              <span className="flex items-center gap-1 font-semibold text-white">
                Explore
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    d="M4 10h11m0 0-4-4m4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
