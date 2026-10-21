"use client";

import Link from "next/link";
import { featuredPackages } from "@/data/packages";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import PackageGrid from "@/components/packages/PackageGrid";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function FeaturedPackages() {
  const { t } = useTranslation();

  return (
    <section id="featured" className="bg-surface py-16 sm:py-20 lg:py-24">
      <Container size="wide">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow={t("packages.eyebrow")}
            title={t("packages.title")}
            description={t("packages.description")}
          />
          <Link
            href="/packages"
            className="group inline-flex items-center gap-1.5 pb-2 text-sm font-bold text-brand-700 transition hover:text-brand-600"
          >
            {t("packages.viewAll")}
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <PackageGrid items={featuredPackages} />
      </Container>
    </section>
  );
}
