"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { OFFICES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import {
  getDestinationGroups,
  getPackageNavItems,
  getHoneymoonDestinationGroups,
  getServiceNavGroups,
} from "@/data/mega-navigation";

// ---------------------------------------------------------------------------
// Data (module-level for stability)
// ---------------------------------------------------------------------------

const destGroups = getDestinationGroups();
const serviceGroups = getServiceNavGroups();
const honeymoonGroups = getHoneymoonDestinationGroups();
const honeymoonPkgs = getPackageNavItems("honeymoon", 6);
const intlPkgs = getPackageNavItems("international", 6);
const domesticPkgs = getPackageNavItems("domestic", 6);

// ---------------------------------------------------------------------------
// Accordion section
// ---------------------------------------------------------------------------

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-display text-base font-bold text-ink-900">{title}</span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className={cn("size-4 text-ink-500 transition-transform duration-200", open && "rotate-180")}
          aria-hidden="true"
        >
          <path d="m5 7 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className={cn("overflow-hidden transition-all duration-200", open ? "max-h-[600px] pb-4" : "max-h-0")}>
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MobileMenu
// ---------------------------------------------------------------------------

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { t } = useTranslation();

  // Close on route change
  useEffect(() => { onClose(); }, [pathname, onClose]);

  // Scroll lock + Escape
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handler);
    };
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-60 lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close navigation menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-brand-900/50 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Slide-in drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-surface shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header row */}
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <LanguageSwitcher tone="dark" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="grid size-10 place-items-center rounded-full text-ink-600 transition hover:bg-surface-soft hover:text-ink-900"
          >
            <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
              <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <nav className="flex-1 overflow-y-auto px-5 py-3" aria-label="Mobile navigation">
          {/* Direct links */}
          <div className="border-b border-line pb-3 mb-1">
            <Link href="/" className="block py-3 font-display text-base font-bold text-ink-900 hover:text-brand-700 transition">
              {t("nav.home")}
            </Link>
          </div>

          {/* Destinations accordion */}
          <Accordion title={t("nav.destinations")}>
            <div className="space-y-4">
              {destGroups.map((group) => (
                <div key={group.region}>
                  <p className="mb-1.5 text-[10px] font-black tracking-widest text-brand-500 uppercase">
                    {group.region}
                  </p>
                  <ul className="space-y-1">
                    {group.destinations.map((dest) => (
                      <li key={dest.slug}>
                        <Link
                          href={dest.href}
                          className="block py-1 text-sm text-ink-600 hover:text-brand-700 transition"
                        >
                          {dest.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <Link
                href="/destinations"
                className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-100 transition"
              >
                All destinations →
              </Link>
            </div>
          </Accordion>

          {/* Packages accordion */}
          <Accordion title={t("nav.packages")}>
            <div className="space-y-4">
              {[
                { label: "International", items: intlPkgs, href: "/packages?category=international" },
                { label: "Domestic (India)", items: domesticPkgs, href: "/packages?category=domestic" },
              ].map(({ label, items, href }) => (
                <div key={label}>
                  <p className="mb-1.5 text-[10px] font-black tracking-widest text-brand-500 uppercase">
                    {label}
                  </p>
                  {items.length > 0 ? (
                    <ul className="space-y-1">
                      {items.map((pkg) => (
                        <li key={pkg.slug}>
                          <Link
                            href={pkg.href}
                            className="block py-1 text-sm text-ink-600 hover:text-brand-700 transition"
                          >
                            {pkg.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-ink-500">No packages yet</p>
                  )}
                  <Link
                    href={href}
                    className="mt-2 inline-block text-xs font-semibold text-brand-600 hover:text-brand-800 transition"
                  >
                    View all →
                  </Link>
                </div>
              ))}
              <Link
                href="/packages"
                className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-100 transition"
              >
                Browse all packages →
              </Link>
            </div>
          </Accordion>

          {/* Honeymoon accordion */}
          <Accordion title={t("nav.honeymoon")}>
            <div className="space-y-4">
              {honeymoonGroups.map((group) => (
                <div key={group.region}>
                  <p className="mb-1.5 text-[10px] font-black tracking-widest text-brand-500 uppercase">
                    {group.region}
                  </p>
                  <ul className="space-y-1">
                    {group.destinations.map((dest) => (
                      <li key={dest.slug}>
                        <Link
                          href={dest.href}
                          className="block py-1 text-sm text-ink-600 hover:text-brand-700 transition"
                        >
                          {dest.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {honeymoonPkgs.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[10px] font-black tracking-widest text-brand-500 uppercase">
                    Packages
                  </p>
                  <ul className="space-y-1">
                    {honeymoonPkgs.map((pkg) => (
                      <li key={pkg.slug}>
                        <Link
                          href={pkg.href}
                          className="block py-1 text-sm text-ink-600 hover:text-brand-700 transition"
                        >
                          {pkg.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                <Link
                  href="/contact?interest=honeymoon"
                  className="inline-flex items-center rounded-full bg-brand-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-600 transition"
                >
                  Plan a Honeymoon
                </Link>
                <Link
                  href="/packages?category=honeymoon"
                  className="inline-flex items-center rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-700 hover:text-brand-700 transition"
                >
                  View all
                </Link>
              </div>
            </div>
          </Accordion>

          {/* Services accordion */}
          <Accordion title={t("nav.services")}>
            <div className="space-y-4">
              {serviceGroups.map((group) => (
                <div key={group.group}>
                  <p className="mb-1.5 text-[10px] font-black tracking-widest text-brand-500 uppercase">
                    {group.group}
                  </p>
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={item.href}
                          className="block py-1 text-sm text-ink-600 hover:text-brand-700 transition"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <Link
                href="/services"
                className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-100 transition"
              >
                All services →
              </Link>
            </div>
          </Accordion>

          {/* Direct links */}
          <div className="border-t border-line pt-3 mt-1 space-y-1">
            <Link href="/about" className="block py-3 font-display text-base font-bold text-ink-900 hover:text-brand-700 transition">
              {t("nav.about")}
            </Link>
            <Link href="/contact" className="block py-3 font-display text-base font-bold text-ink-900 hover:text-brand-700 transition">
              {t("nav.contact")}
            </Link>
          </div>
        </nav>

        {/* Footer: offices + contact */}
        <div className="border-t border-line bg-surface-soft px-5 py-5 shrink-0">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {OFFICES.map((o) => (
              <span
                key={o.city}
                className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-ink-600 ring-1 ring-line"
              >
                {o.city}
              </span>
            ))}
          </div>
          <div className="mb-4 flex items-center justify-between rounded-xl bg-white p-3 ring-1 ring-line">
            <div>
              <p className="text-xs font-bold text-ink-900">Custom Trip Planning</p>
              <p className="text-[11px] text-ink-500">Bespoke itineraries & quotes</p>
            </div>
            <Link
              href="/contact"
              onClick={onClose}
              className="text-xs font-bold text-brand-700 hover:text-brand-900"
            >
              Contact Desk →
            </Link>
          </div>
          <ButtonLink href="/contact" className="w-full text-center">
            {t("nav.planTrip")}
          </ButtonLink>
        </div>
      </aside>
    </div>
  );
}
