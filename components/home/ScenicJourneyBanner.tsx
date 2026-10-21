"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function ScenicJourneyBanner() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-brand-900 py-20 sm:py-24 lg:py-28 text-white">
      {/* Background Photography with atmospheric gradients */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/packages/imported/munnar-hillstation-kerala.webp"
          alt="Munnar tea plantations and mist-covered hills in Kerala"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-60 select-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-brand-950/95 via-brand-900/85 to-brand-900/60"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-radial-at-c from-transparent via-brand-900/40 to-brand-950/80"
        />
      </div>

      <Container size="wide" className="relative z-10">
        <div className="max-w-2xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-200 backdrop-blur-md ring-1 ring-white/20">
              <span className="size-1.5 rounded-full bg-brand-300 animate-pulse" />
              {t("scenicBanner.eyebrow")}
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-[1.12]">
              {t("scenicBanner.title")}
              <br />
              <span className="text-brand-300 font-semibold">{t("scenicBanner.titleHighlight")}</span>
            </h2>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-brand-100/90 font-light">
              {t("scenicBanner.description")}
            </p>

            {/* Travel Assurance Highlights */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 pt-6 border-t border-white/15">
              <div className="flex items-start gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-brand-500/20 text-brand-300 ring-1 ring-white/15">
                  ✓
                </span>
                <div>
                  <p className="text-sm font-bold text-white">{t("scenicBanner.feature1")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-brand-500/20 text-brand-300 ring-1 ring-white/15">
                  ✓
                </span>
                <div>
                  <p className="text-sm font-bold text-white">{t("scenicBanner.feature2")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-brand-500/20 text-brand-300 ring-1 ring-white/15">
                  ✓
                </span>
                <div>
                  <p className="text-sm font-bold text-white">{t("scenicBanner.feature3")}</p>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_-8px_rgba(47,134,239,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-400 focus-visible:outline-2 focus-visible:outline-white"
              >
                <span>{t("scenicBanner.ctaCustom")}</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:border-white/40"
              >
                {t("scenicBanner.ctaCall")}
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
