"use client";

import Link from "next/link";
import { trendingDestinations } from "@/data/destinations";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import DestinationGrid from "@/components/destinations/DestinationGrid";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function DestinationSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-surface py-16 sm:py-20 lg:py-24">
      <Container size="wide">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow={t("destinations.eyebrow")}
            title={t("destinations.title")}
            description={t("destinations.description")}
          />
          <Link
            href="/destinations"
            className="group inline-flex items-center gap-1.5 pb-2 text-sm font-bold text-brand-700 transition hover:text-brand-600"
          >
            {t("destinations.viewAll")}
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <DestinationGrid items={trendingDestinations} />
      </Container>
    </section>
  );
}
