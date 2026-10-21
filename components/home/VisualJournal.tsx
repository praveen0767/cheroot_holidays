import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

interface JournalPhoto {
  id: string;
  image: string;
  destination: string;
  country: string;
  caption: string;
  href: string;
  span?: string;
}

const JOURNAL_PHOTOS: JournalPhoto[] = [
  {
    id: "bali-temple",
    image: "/destinations/bali.jpg",
    destination: "Bali",
    country: "Indonesia",
    caption: "Ancient candi bentar gates opening toward tranquil volcanic ridges at dawn.",
    href: "/destinations/bali",
    span: "md:col-span-2 md:row-span-2 min-h-[360px] md:min-h-[480px]",
  },
  {
    id: "dubai-skyline",
    image: "/packages/imported/2jfz2vj06sk.webp",
    destination: "Dubai",
    country: "United Arab Emirates",
    caption: "The soaring spire of Burj Khalifa illuminated against an azure desert twilight.",
    href: "/destinations/dubai",
    span: "md:col-span-1 min-h-[240px]",
  },
  {
    id: "kashmir-dallake",
    image: "/destinations/kashmir.jpg",
    destination: "Kashmir",
    country: "India",
    caption: "Handcrafted cedar shikaras drifting quietly upon mirror-calm Dal Lake.",
    href: "/destinations/kashmir",
    span: "md:col-span-1 min-h-[240px]",
  },
  {
    id: "goa-sunset",
    image: "/destinations/goa.jpg",
    destination: "Goa",
    country: "India",
    caption: "Silhouette of leaning coastal palms against a fiery Arabian Sea horizon.",
    href: "/destinations/goa",
    span: "md:col-span-1 min-h-[240px]",
  },
  {
    id: "kerala-backwater",
    image: "/packages/imported/water-boat-kerala-870x555-1.webp",
    destination: "Kerala",
    country: "India",
    caption: "Traditional kettuvallam houseboats gliding past palm-fringed backwaters.",
    href: "/destinations/kerala",
    span: "md:col-span-1 min-h-[240px]",
  },
];

export default function VisualJournal() {
  return (
    <section className="bg-surface py-16 sm:py-20 lg:py-24">
      <Container size="wide">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Cheroot Atlas"
            title="Moments captured along the way"
            description="A glimpse into the landscapes, quiet dawns, and cultural landmarks awaiting you."
          />
          <Link
            href="/destinations"
            className="group inline-flex items-center gap-1.5 pb-2 text-sm font-bold text-brand-700 transition hover:text-brand-600"
          >
            Discover all destinations
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {JOURNAL_PHOTOS.map((photo, i) => (
            <Reveal
              key={photo.id}
              delay={i * 60}
              className={`relative overflow-hidden rounded-3xl border border-line bg-brand-900 group ${photo.span ?? ""}`}
            >
              <Link href={photo.href} className="block relative size-full min-h-[240px] focus-visible:outline-2 focus-visible:outline-brand-400">
                <Image
                  src={photo.image}
                  alt={`${photo.destination}, ${photo.country} — ${photo.caption}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/40 to-transparent transition-opacity group-hover:opacity-90"
                />

                {/* Location Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-900/80 px-3 py-1 text-xs font-bold text-brand-200 uppercase tracking-wider backdrop-blur-md ring-1 ring-white/15">
                    <span className="size-1.5 rounded-full bg-brand-400" />
                    {photo.destination} · {photo.country}
                  </span>
                </div>

                {/* Bottom Caption */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-10 text-white">
                  <p className="text-sm sm:text-base font-semibold leading-snug drop-shadow-sm text-white/95">
                    {photo.caption}
                  </p>
                  <p className="mt-2 text-xs font-bold text-brand-300 flex items-center gap-1 opacity-0 transform translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                    <span>Explore {photo.destination}</span>
                    <span>→</span>
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
