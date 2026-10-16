import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import TripPlanner from "@/components/hero/TripPlanner";
import Badge from "@/components/ui/Badge";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-900 pt-28 pb-0 md:pt-40 md:pb-24">
      {/* Atmospheric layers */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(47,134,239,0.55),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(90,164,245,0.35),transparent_50%),linear-gradient(160deg,#07235a_0%,#0b3487_55%,#1250c4_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-32 size-[520px] rounded-full border border-white/10"
      />
      <div
        aria-hidden="true"
        className="absolute top-10 -right-10 size-[320px] rounded-full border border-white/15"
      />

      {/* Floating compass / pin ornaments (restrained motion) */}
      <div
        aria-hidden="true"
        className="float-slow absolute top-32 right-[12%] hidden size-12 place-items-center rounded-2xl bg-white/10 backdrop-blur-sm lg:grid"
      >
        <PinGlyph className="size-6 text-white" />
      </div>
      <div
        aria-hidden="true"
        className="float-slower absolute bottom-40 left-[8%] hidden size-14 place-items-center rounded-full bg-white/10 backdrop-blur-sm lg:grid"
      >
        <CompassGlyph className="size-7 text-white" />
      </div>

      <Container className="relative">
        <div className="max-w-3xl">
          <Badge tone="glass" className="mb-6">
            <span className="size-1.5 rounded-full bg-brand-300" />
            Explore · Experience · Enjoy
          </Badge>

          <h1 className="text-4xl leading-[1.05] font-extrabold text-white sm:text-5xl lg:text-6xl">
            Your next story
            <br />
            starts here.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-100/85 sm:text-lg">
            Discover thoughtfully planned journeys, unforgettable stays, and
            experiences built around the way you want to travel.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/destinations" size="lg">
              Explore journeys
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg">
              Plan a trip
            </ButtonLink>
          </div>
        </div>

        {/* Trip planner — overlaps into the next section on desktop */}
        <div className="mt-10 md:mt-14 lg:-mb-18">
          <p className="mb-3 hidden text-xs font-bold tracking-[0.18em] text-brand-200 uppercase md:block">
            Plan your journey
          </p>
          <TripPlanner />
        </div>
      </Container>

      {/* Wave transition into the white page */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 hidden h-16 w-full text-surface md:block"
      >
        <path d="M0 80h1440V30c-240 30-480 40-720 30S240 30 0 55Z" fill="currentColor" />
      </svg>
    </section>
  );
}

function PinGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 17s5.5-5.1 5.5-9a5.5 5.5 0 1 0-11 0c0 3.9 5.5 9 5.5 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CompassGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="7.2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m12.8 7.2-1.6 4-4 1.6 1.6-4 4-1.6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
