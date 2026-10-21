import Link from "next/link";
import Container from "@/components/ui/Container";

const DESTINATIONS = [
  { name: "Dubai", region: "UAE", href: "/destinations/dubai" },
  { name: "Bali", region: "Indonesia", href: "/destinations/bali" },
  { name: "Kashmir", region: "North India", href: "/destinations/kashmir" },
  { name: "Goa", region: "West Coast", href: "/destinations/goa" },
  { name: "Maldives", region: "Indian Ocean", href: "/destinations/maldives" },
  { name: "Kerala", region: "South India", href: "/destinations/kerala" },
  { name: "Munnar", region: "Tea Highlands", href: "/packages?q=munnar" },
  { name: "Wayanad", region: "Misty Valleys", href: "/packages?q=wayanad" },
];

export default function DestinationJourneyStrip() {
  return (
    <section className="bg-brand-950 text-white py-12 border-b border-white/10 overflow-hidden">
      <Container>
        {/* Subtle Brand Motif & Journey Line Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-500/20 text-brand-300 ring-1 ring-white/15">
              <CompassGlyph className="size-5" />
            </span>
            <div>
              <p className="text-xs font-bold tracking-widest text-brand-300 uppercase">
                Cheroot Journey Line
              </p>
              <p className="text-base font-bold text-white">
                Handcrafted itineraries across iconic landscapes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-brand-200/80">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span>Accepting tailored bookings for upcoming travel seasons</span>
          </div>
        </div>

        {/* Destination Badges Grid / Row */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {DESTINATIONS.map((dest) => (
            <Link
              key={dest.name}
              href={dest.href}
              className="group flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3.5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-400 hover:bg-white/10"
            >
              <span className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                {dest.name}
              </span>
              <span className="text-[10px] text-brand-100 mt-0.5">
                {dest.region}
              </span>
            </Link>
          ))}
        </div>

        {/* Editorial Quote Banner inspired by reference */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-r from-brand-900/70 via-brand-900/40 to-brand-900/70 p-6 sm:p-8 text-center backdrop-blur-xs">
          <p className="font-serif italic text-xl sm:text-2xl text-white">
            &ldquo;Life is an invitation to explore. The world is wide, and your next story is waiting.&rdquo;
          </p>
          <p className="mt-2 text-xs font-bold tracking-widest text-brand-200 uppercase">
            Cheroot Holidays · Explore · Experience · Enjoy
          </p>
        </div>
      </Container>
    </section>
  );
}

function CompassGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m12.8 7.2-1.6 4-4 1.6 1.6-4 4-1.6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
