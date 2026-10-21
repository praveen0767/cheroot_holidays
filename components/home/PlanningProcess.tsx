"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const STEPS = [
  {
    step: "01",
    title: "Share Your Vision",
    description:
      "Tell us where you dream of going, who you are travelling with, your preferred pace, and budget. No rigid packages — everything starts with your intent.",
    badge: "Consultation",
  },
  {
    step: "02",
    title: "Tailored Proposal",
    description:
      "Our travel specialists craft a personalised itinerary with transparent pricing, handpicked stays, and recommended activities tailored to your dates.",
    badge: "Customization",
  },
  {
    step: "03",
    title: "Seamless Coordination",
    description:
      "We handle flights, verified hotel reservations, comfortable transfers, and visa guidance under one single, dedicated point of contact.",
    badge: "Logistics",
  },
  {
    step: "04",
    title: "Journey with Confidence",
    description:
      "Travel knowing a dedicated specialist is reachable whenever you need assistance, flight disruption support, or local recommendations.",
    badge: "Support",
  },
];

export default function PlanningProcess() {
  const { t } = useTranslation();

  const stepsData = [
    {
      step: "01",
      title: t("planning.step1Title"),
      description: t("planning.step1Desc"),
      badge: t("planning.step1Badge"),
    },
    {
      step: "02",
      title: t("planning.step2Title"),
      description: t("planning.step2Desc"),
      badge: t("planning.step2Badge"),
    },
    {
      step: "03",
      title: t("planning.step3Title"),
      description: t("planning.step3Desc"),
      badge: t("planning.step3Badge"),
    },
    {
      step: "04",
      title: t("planning.step4Title"),
      description: t("planning.step4Desc"),
      badge: t("planning.step4Badge"),
    },
  ];

  return (
    <section id="how-we-plan" className="bg-surface-soft py-16 sm:py-20 lg:py-24 border-y border-line/60 scroll-mt-24">
      <Container size="wide">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow={t("planning.eyebrow")}
            title={t("planning.title")}
            description={t("planning.description")}
          />
          <Link
            href="/contact"
            className="group inline-flex items-center gap-1.5 pb-2 text-sm font-bold text-brand-700 transition hover:text-brand-600 cursor-pointer"
          >
            {t("planning.startPlan")}
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stepsData.map((s, i) => (
            <Reveal key={s.step} delay={i * 80}>
              <div className="relative flex h-full flex-col rounded-3xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-brand-200">
                    {s.step}
                  </span>
                  <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-700 uppercase tracking-wider">
                    {s.badge}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-ink-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600 flex-1">
                  {s.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
