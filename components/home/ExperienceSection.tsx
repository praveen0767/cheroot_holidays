import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

interface ExperienceItem {
  id: string;
  title: string;
  tagline: string;
  image: string;
  destination: string;
  category: string;
  href: string;
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: "kashmir-alpine",
    title: "Alpine & Snowline Expeditions",
    tagline: "Glide past shikaras on Dal Lake and ascend into snow-draped Pir Panjal mountain passes.",
    image: "/destinations/kashmir.jpg",
    destination: "Kashmir, India",
    category: "Mountain Trails",
    href: "/packages/kashmir-snowline-journey",
  },
  {
    id: "goa-coastal",
    title: "Coastal & Sunset Escapes",
    tagline: "Sunlit coconut groves, serene Arabian Sea beaches, and relaxed slow-living shores.",
    image: "/destinations/goa.jpg",
    destination: "Goa, India",
    category: "Coastal Getaways",
    href: "/packages/goa-coastal-getaway",
  },
  {
    id: "bali-temple",
    title: "Sacred Sanctuaries & Island Romance",
    tagline: "Handcrafted private pool villas, ancient stone gates, and lush jungle canopies.",
    image: "/destinations/bali.jpg",
    destination: "Bali, Indonesia",
    category: "Honeymoon & Retreats",
    href: "/packages/bali-serenity-honeymoon",
  },
  {
    id: "kerala-backwaters",
    title: "Tranquil Backwater Houseboat Trails",
    tagline: "Private cedar houseboats drifting past emerald paddy banks and serene village lagoons.",
    image: "/packages/imported/water-boat-kerala-870x555-1.webp",
    destination: "Kerala, India",
    category: "Heritage & Nature",
    href: "/packages/kerala-backwaters-trail",
  },
];

export default function ExperienceSection() {
  return (
    <section className="bg-surface-soft py-16 sm:py-20 lg:py-24 border-y border-line/60">
      <Container size="wide">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Signature Experiences"
            title="Adventures crafted for unforgettable moments"
            description="From snow-capped mountain valleys to tropical beach sanctuaries, discover handpicked travel styles that match your wanderlust."
          />
          <Link
            href="/packages"
            className="group inline-flex items-center gap-1.5 pb-2 text-sm font-bold text-brand-700 transition hover:text-brand-600"
          >
            Explore all experiences
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {EXPERIENCES.map((exp, i) => (
            <Reveal key={exp.id} delay={i * 80}>
              <Link
                href={exp.href}
                className="group relative flex h-[380px] sm:h-[420px] flex-col justify-end overflow-hidden rounded-3xl border border-line bg-brand-900 p-6 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand-400 focus-visible:outline-2 focus-visible:outline-brand-400"
              >
                {/* Background Image with subtle zoom on hover */}
                <Image
                  src={exp.image}
                  alt={`${exp.destination} — ${exp.title}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark Vignette Gradient */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/60 to-transparent"
                />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="rounded-full bg-brand-900/80 px-3 py-1 text-xs font-bold text-brand-200 uppercase tracking-wider backdrop-blur-md ring-1 ring-white/15">
                    {exp.category}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10">
                  <p className="text-xs font-semibold text-brand-300 flex items-center gap-1.5">
                    <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden="true">
                      <path
                        d="M8 14s4-3.5 4-7a4 4 0 1 0-8 0c0 3.5 4 7 4 7Z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                      <circle cx="8" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                    {exp.destination}
                  </p>

                  <h3 className="mt-1 text-xl font-bold leading-snug text-white group-hover:text-brand-200 transition-colors">
                    {exp.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-brand-100/80 line-clamp-2">
                    {exp.tagline}
                  </p>

                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-brand-300 group-hover:text-white transition-colors">
                    <span>View journey</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
