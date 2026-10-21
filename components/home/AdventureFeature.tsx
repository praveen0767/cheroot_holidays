import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";

export default function AdventureFeature() {
  return (
    <section className="bg-surface py-16 sm:py-20 lg:py-24 border-b border-line/60 overflow-hidden">
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Editorial Copy & Core Assurances */}
          <div className="lg:col-span-6">
            <Reveal>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 ring-1 ring-brand-200">
                <span className="size-1.5 rounded-full bg-brand-500 animate-pulse" />
                Unbounded Exploration
              </span>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl leading-[1.12]">
                Find your next
                <br />
                <span className="text-brand-600">great adventure.</span>
              </h2>

              <p className="mt-5 text-base sm:text-lg leading-relaxed text-ink-600">
                Step away from ordinary tourist crowds. Whether trekking pine-scented
                valleys in Kashmir, exploring quiet spice hills in Kerala, or cruising
                sunlit coastal backwaters, we craft adventures that balance exhilarating
                discovery with dependable comfort.
              </p>

              {/* Two Core Feature Cards inspired by reference */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3.5 rounded-2xl border border-line bg-surface-soft/80 p-4 transition hover:border-brand-200 hover:bg-white">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <CompassIcon className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink-900">Bespoke Pacing</h3>
                    <p className="mt-1 text-xs leading-relaxed text-ink-600">
                      Journeys planned around your endurance, curiosity, and private schedule.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-2xl border border-line bg-surface-soft/80 p-4 transition hover:border-brand-200 hover:bg-white">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <ShieldIcon className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink-900">Verified Safety</h3>
                    <p className="mt-1 text-xs leading-relaxed text-ink-600">
                      Vetted local private transport, emergency contacts, and reliable verified stays.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/packages"
                  className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-brand-600"
                >
                  <span>Explore Adventure Packages</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
                >
                  Request Custom Trek/Tour
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Layered Editorial Photo Composition */}
          <div className="lg:col-span-6 relative">
            <Reveal delay={120}>
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Decorative orbit ring */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-8 -right-8 size-72 rounded-full border border-brand-200/50 -z-10"
                />

                {/* Primary Card (Kashmir mountain scene) */}
                <div className="relative z-10 overflow-hidden rounded-3xl border border-line bg-white shadow-xl aspect-4/3 sm:aspect-16/11">
                  <Image
                    src="/destinations/kashmir.jpg"
                    alt="Alpine mountains and Dal Lake in Kashmir"
                    fill
                    sizes="(max-width: 1024px) 100vw, 540px"
                    className="object-cover object-center"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent"
                  />
                  <div className="absolute bottom-4 inset-x-4 text-white">
                    <span className="rounded-full bg-brand-900/70 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
                      Mountain Expeditions
                    </span>
                    <p className="mt-1 text-sm font-bold">Pir Panjal Passes & Alpine Lakes</p>
                  </div>
                </div>

                {/* Layered Accent Card (Goa sunset coast) */}
                <div className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-8 z-20 w-44 sm:w-56 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl aspect-square">
                  <Image
                    src="/destinations/goa.jpg"
                    alt="Goa coastal sunset with palms"
                    fill
                    sizes="240px"
                    className="object-cover object-center"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-transparent"
                  />
                  <div className="absolute bottom-2.5 inset-x-2.5 text-white">
                    <p className="text-xs font-bold leading-tight">Coastal Escapes</p>
                    <p className="text-[10px] text-brand-200">Arabian Sea shores</p>
                  </div>
                </div>

                {/* Floating Experience Badge */}
                <div className="absolute -top-4 -left-3 sm:-top-6 sm:left-4 z-20 flex items-center gap-2 rounded-full border border-line bg-white/95 px-4 py-2 shadow-lg backdrop-blur-md">
                  <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-ink-900">All-Season Adventures</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m14.5 9.5-2 5-3 1 2-5 3-1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
