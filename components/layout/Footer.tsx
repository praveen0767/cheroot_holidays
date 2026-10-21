"use client";

import Link from "next/link";
import { NAV, CONTACT, OFFICES } from "@/lib/constants";
import Container from "@/components/ui/Container";
import { destinations } from "@/data/destinations";
import { services } from "@/data/services";
import { useTranslation } from "@/lib/i18n/LanguageContext";

// Evaluated once at module load so prerendering sees a stable value.
const YEAR = new Date().getFullYear();

export default function Footer() {
  const { t, locale } = useTranslation();
  return (
    <footer className="bg-brand-900 text-brand-100">
      <Container size="wide" className="py-14 lg:py-18">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="block size-12 rounded-xl bg-white ring-1 ring-white/20"
                style={{
                  backgroundImage: "url(/brand/cheroot-logo.png)",
                  backgroundSize: "170%",
                  backgroundPosition: "center 21%",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <span className="font-display text-xl font-extrabold text-white">
                Cheroot <span className="font-semibold text-brand-300">Holidays</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-100/70">
              {t("footer.tagline")}
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <a
                href={`tel:${CONTACT.phoneHref}`}
                className="rounded-full bg-white/10 px-4 py-2 font-semibold text-white transition hover:bg-white/20"
              >
                {CONTACT.phone}
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="rounded-full bg-white/10 px-4 py-2 font-semibold text-white transition hover:bg-white/20"
              >
                {locale === "ta" ? "மின்னஞ்சல்" : "Email us"}
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              {t("footer.destinations")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {destinations.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/destinations/${d.slug}`}
                    className="text-brand-100/75 transition hover:text-white"
                  >
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              {t("footer.services")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-brand-100/75 transition hover:text-white"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              {t("footer.quickLinks")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-brand-100/75 transition hover:text-white">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/packages" className="text-brand-100/75 transition hover:text-white">
                  {t("nav.packages")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-brand-100/75 transition hover:text-white">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-brand-100/75 transition hover:text-white">
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
            <h3 className="mt-6 text-sm font-bold tracking-wider text-white uppercase">
              {locale === "ta" ? "அலுவலகங்கள்" : "Offices"}
            </h3>
            <p className="mt-3 text-sm text-brand-100/75">
              {OFFICES.map((o) => o.city).join(" · ")}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-brand-100/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {YEAR} {t("footer.copyright")}</p>
          <p className="tracking-wider">EXPLORE · EXPERIENCE · ENJOY</p>
        </div>
      </Container>
    </footer>
  );
}
