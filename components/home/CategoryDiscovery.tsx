"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  href: string;
  image: string;
  accentFrom: string;
  accentTo: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "international",
    title: "International Escapes",
    subtitle: "Curated overseas journeys across Dubai, Southeast Asia, and island retreats.",
    badge: "Global Journeys",
    href: "/packages?category=international",
    image: "/packages/imported/2jfz2vj06sk.webp",
    accentFrom: "from-blue-900/60",
    accentTo: "to-brand-950/90",
  },
  {
    id: "domestic",
    title: "Incredible India",
    subtitle: "From Kashmir's alpine valleys to Kerala's backwaters and Goa's sunlit shores.",
    badge: "Domestic Wonders",
    href: "/packages?category=domestic",
    image: "/destinations/kashmir.jpg",
    accentFrom: "from-emerald-900/60",
    accentTo: "to-brand-950/90",
  },
  {
    id: "honeymoon",
    title: "Honeymoon Retreats",
    subtitle: "Intimate overwater villas and secluded sanctuaries crafted for two.",
    badge: "Couples & Romance",
    href: "/packages?category=honeymoon",
    image: "/packages/bali-serenity-honeymoon.jpg",
    accentFrom: "from-rose-900/60",
    accentTo: "to-brand-950/90",
  },
  {
    id: "heritage",
    title: "Heritage & Culture",
    subtitle: "Ancient temple trails, spice routes, and deep regional traditions of India.",
    badge: "Cultural Journeys",
    href: "/destinations",
    image: "/packages/imported/hwy9r6-yzgm.webp",
    accentFrom: "from-amber-900/60",
    accentTo: "to-brand-950/90",
  },
  {
    id: "adventure",
    title: "Adventure & Outdoors",
    subtitle: "High-altitude passes, snow trails, and rugged terrains for thrill-seekers.",
    badge: "High Adrenaline",
    href: "/packages?style=adventure",
    image: "/packages/imported/pf-rtgtewyc.webp",
    accentFrom: "from-slate-900/60",
    accentTo: "to-brand-950/90",
  },
  {
    id: "custom",
    title: "Custom Itineraries",
    subtitle: "Bespoke day-by-day programs shaped strictly around your private preferences.",
    badge: "Tailor-Made",
    href: "/services/custom-itineraries",
    image: "/packages/goa-coastal-getaway.jpg",
    accentFrom: "from-violet-900/60",
    accentTo: "to-brand-950/90",
  },
];

export default function CategoryDiscovery() {
  const { t } = useTranslation();

  const categoryTranslations: Record<
    string,
    { title: string; subtitle: string; badge: string }
  > = {
    international: {
      title: t("categories.internationalTitle"),
      subtitle: t("categories.internationalDesc"),
      badge: t("categories.internationalBadge"),
    },
    domestic: {
      title: t("categories.domesticTitle"),
      subtitle: t("categories.domesticDesc"),
      badge: t("categories.domesticBadge"),
    },
    honeymoon: {
      title: t("categories.honeymoonTitle"),
      subtitle: t("categories.honeymoonDesc"),
      badge: t("categories.honeymoonBadge"),
    },
    heritage: {
      title: t("categories.heritageTitle"),
      subtitle: t("categories.heritageDesc"),
      badge: t("categories.heritageBadge"),
    },
    adventure: {
      title: t("categories.adventureTitle"),
      subtitle: t("categories.adventureDesc"),
      badge: t("categories.adventureBadge"),
    },
    custom: {
      title: t("categories.customTitle"),
      subtitle: t("categories.customDesc"),
      badge: t("categories.customBadge"),
    },
  };

  return (
    <section className="bg-surface py-16 sm:py-20 lg:py-28">
      <Container size="wide">
        {/* ── Section Header ── */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-bold tracking-wider text-brand-700 uppercase ring-1 ring-brand-200/60 mb-3">
              {t("categories.eyebrow")}
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              {t("categories.title")}
            </h2>
            <p className="mt-3 max-w-2xl text-base text-ink-600 leading-relaxed">
              {t("categories.subtitle")}
            </p>
          </div>
          <Link
            href="/packages"
            className="group inline-flex items-center gap-1.5 pb-2 text-sm font-bold text-brand-700 transition hover:text-brand-600"
          >
            {t("categories.browseAll")}
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        {/* ── Image-led grid ── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => {
            const tr = categoryTranslations[cat.id] || cat;
            return (
              <Reveal key={cat.id} delay={i * 70}>
                <Link
                  href={cat.href}
                  className="group relative flex h-[280px] sm:h-[300px] flex-col justify-end overflow-hidden rounded-3xl border border-line shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-brand-500"
                >
                  {/* Photography */}
                  <Image
                    src={cat.image}
                    alt={`${tr.title} — Cheroot Holidays`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradient overlay */}
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 bg-gradient-to-t ${cat.accentFrom} ${cat.accentTo} transition-opacity duration-300 group-hover:opacity-90`}
                  />

                  {/* Top badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-wider text-white uppercase backdrop-blur-md ring-1 ring-white/20">
                      {tr.badge}
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div className="relative z-10 p-5 sm:p-6">
                    <h3 className="text-lg font-extrabold text-white leading-snug group-hover:text-brand-200 transition-colors">
                      {tr.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/75 line-clamp-2">
                      {tr.subtitle}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-brand-300 group-hover:text-white transition-colors">
                      <span>{t("categories.discoverExperiences")}</span>
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        className="size-3.5 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 8h10m0 0-3.5-3.5M13 8l-3.5 3.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
