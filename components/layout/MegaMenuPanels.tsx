"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type {
  NavDestinationGroup,
  NavPackageItem,
  NavServiceGroup,
  NavFeaturedCard,
  NavCategory,
} from "@/data/mega-navigation";

// ---------------------------------------------------------------------------
// Shared panel wrapper
// ---------------------------------------------------------------------------

export function MegaMenuPanel({
  id,
  triggerId,
  open,
  onClose,
  className,
  children,
}: {
  id: string;
  triggerId?: string;
  open: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape & return focus to trigger
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        if (triggerId) {
          document.getElementById(triggerId)?.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose, triggerId]);

  return (
    <div
      id={id}
      ref={panelRef}
      role="region"
      aria-hidden={!open}
      className={cn(
        "absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 transition-all duration-200 ease-out",
        "before:absolute before:-top-3 before:inset-x-0 before:h-4 before:content-['']",
        open
          ? "pointer-events-auto translate-y-0 opacity-100 visible"
          : "pointer-events-none -translate-y-2 opacity-0 invisible",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-2xl border border-line/80 bg-surface shadow-2xl shadow-brand-900/15">
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared: featured destination/package card
// ---------------------------------------------------------------------------

export function FeaturedCard({
  card,
  compact = false,
}: {
  card: NavFeaturedCard;
  compact?: boolean;
}) {
  return (
    <Link
      href={card.href}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-line/60 bg-brand-950"
    >
      {/* Image */}
      <div className={cn("relative w-full overflow-hidden", compact ? "h-32" : "h-40")}>
        <Image
          src={card.image}
          alt={card.destination}
          fill
          sizes="260px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-900/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-3.5">
        <p className="text-[10px] font-bold tracking-widest text-brand-300 uppercase">
          {card.destination}
        </p>
        {card.packageTitle && (
          <p className="mt-0.5 text-xs font-bold text-white leading-snug line-clamp-2">
            {card.packageTitle}
          </p>
        )}
        <p className="mt-1 text-[10px] leading-relaxed text-brand-200/80 line-clamp-2">
          {card.tagline}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-[10px] font-bold text-white transition group-hover:bg-brand-500">
          {card.ctaLabel}
          <svg viewBox="0 0 12 12" fill="none" className="size-2.5" aria-hidden="true">
            <path d="m4 2 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Destinations mega menu panel
// ---------------------------------------------------------------------------

export function DestinationsMegaMenu({
  id,
  triggerId,
  open,
  onClose,
  destinationGroups,
  featuredCard,
}: {
  id: string;
  triggerId?: string;
  open: boolean;
  onClose: () => void;
  destinationGroups: NavDestinationGroup[];
  featuredCard: NavFeaturedCard;
}) {
  return (
    <MegaMenuPanel
      id={id}
      triggerId={triggerId}
      open={open}
      onClose={onClose}
      className="w-[820px] max-w-[calc(100vw-2rem)]"
    >
      <div className="grid grid-cols-[1fr_220px]">
        {/* Left: destination groups + header */}
        <div className="p-6">
          <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-brand-600 uppercase">
                Compass Atlas
              </p>
              <p className="text-sm font-bold text-ink-900 mt-0.5">Explore Destinations</p>
            </div>
            <Link
              href="/destinations"
              onClick={onClose}
              className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition"
            >
              View all
              <svg viewBox="0 0 12 12" fill="none" className="size-2.5" aria-hidden="true">
                <path d="m4 2 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* Destination groups grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            {destinationGroups.map((group) => (
              <div key={group.region}>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[9px] font-black tracking-widest text-brand-400 uppercase">
                    {group.code}
                  </span>
                  <span className="text-[10px] font-bold text-ink-700">{group.region}</span>
                </div>
                <ul className="space-y-1">
                  {group.destinations.map((dest) => (
                    <li key={dest.slug}>
                      <Link
                        href={dest.href}
                        onClick={onClose}
                        className="group/link flex items-center gap-1.5 text-sm text-ink-600 hover:text-brand-700 transition-colors"
                      >
                        {dest.hasPackage && (
                          <span className="size-1 shrink-0 rounded-full bg-brand-400" aria-hidden="true" />
                        )}
                        {!dest.hasPackage && (
                          <span className="size-1 shrink-0 rounded-full bg-line" aria-hidden="true" />
                        )}
                        {dest.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-5 pt-4 border-t border-line flex flex-wrap gap-2">
            {["International", "Domestic", "Honeymoon"].map((cat) => (
              <Link
                key={cat}
                href={`/packages?category=${cat.toLowerCase()}`}
                onClick={onClose}
                className="inline-flex items-center rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink-700 hover:border-brand-300 hover:text-brand-700 transition"
              >
                {cat}
              </Link>
            ))}
            <Link
              href="/contact?interest=custom-trip"
              onClick={onClose}
              className="inline-flex items-center gap-1 rounded-full bg-brand-700 px-3 py-1 text-xs font-bold text-white hover:bg-brand-600 transition"
            >
              Plan a Custom Trip
            </Link>
          </div>
        </div>

        {/* Right: featured card */}
        <div className="border-l border-line bg-brand-950/5 p-4 flex flex-col gap-3">
          <p className="text-[10px] font-bold tracking-widest text-brand-500 uppercase">
            Featured
          </p>
          <FeaturedCard card={featuredCard} />
          <Link
            href="/packages"
            onClick={onClose}
            className="mt-auto text-center text-xs font-semibold text-brand-600 hover:text-brand-800 transition"
          >
            Browse all packages →
          </Link>
        </div>
      </div>
    </MegaMenuPanel>
  );
}

// ---------------------------------------------------------------------------
// Packages mega menu panel
// ---------------------------------------------------------------------------

export function PackagesMegaMenu({
  id,
  triggerId,
  open,
  onClose,
  categories,
  activeCategory,
  onCategoryChange,
  packageItems,
  featuredCard,
}: {
  id: string;
  triggerId?: string;
  open: boolean;
  onClose: () => void;
  categories: NavCategory[];
  activeCategory: string;
  onCategoryChange: (key: string) => void;
  packageItems: NavPackageItem[];
  featuredCard: NavFeaturedCard;
}) {
  const activeCat = categories.find((c) => c.key === activeCategory) ?? categories[0];

  return (
    <MegaMenuPanel
      id={id}
      triggerId={triggerId}
      open={open}
      onClose={onClose}
      className="w-[860px] max-w-[calc(100vw-2rem)]"
    >
      <div className="grid grid-cols-[180px_1fr_210px]">
        {/* Column A: Journey selector */}
        <div className="border-r border-line bg-brand-950/3 py-5 px-3">
          <p className="px-2 mb-3 text-[10px] font-black tracking-widest text-brand-400 uppercase">
            Journey Type
          </p>
          <nav aria-label="Package categories">
            <ul className="space-y-0.5">
              {categories.map((cat) => (
                <li key={cat.key}>
                  <button
                    type="button"
                    onClick={() => onCategoryChange(cat.key)}
                    aria-pressed={activeCategory === cat.key}
                    className={cn(
                      "w-full text-left rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150",
                      activeCategory === cat.key
                        ? "bg-brand-700 text-white shadow-sm"
                        : "text-ink-700 hover:bg-brand-50 hover:text-brand-700",
                    )}
                  >
                    <span className="block">{cat.label}</span>
                    <span
                      className={cn(
                        "block text-[10px] font-normal mt-0.5",
                        activeCategory === cat.key ? "text-brand-200" : "text-ink-500",
                      )}
                    >
                      {cat.description}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Column B: Package items */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-brand-600 uppercase">
                {activeCat?.label}
              </p>
              <p className="text-sm font-bold text-ink-900 mt-0.5">Curated Packages</p>
            </div>
            <Link
              href={activeCat?.href ?? "/packages"}
              onClick={onClose}
              className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition"
            >
              View all
              <svg viewBox="0 0 12 12" fill="none" className="size-2.5" aria-hidden="true">
                <path d="m4 2 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {packageItems.length > 0 ? (
            <ul className="space-y-2">
              {packageItems.map((pkg) => (
                <li key={pkg.slug}>
                  <Link
                    href={pkg.href}
                    onClick={onClose}
                    className="group flex items-center gap-3 rounded-xl p-2 hover:bg-brand-50 transition"
                  >
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={pkg.image}
                        alt={pkg.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-ink-900 group-hover:text-brand-700 transition truncate">
                        {pkg.title}
                      </p>
                      <p className="text-xs text-ink-500 mt-0.5">{pkg.destination}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      {pkg.nights && (
                        <p className="text-[10px] font-semibold text-ink-600">
                          {pkg.nights}N / {pkg.days}D
                        </p>
                      )}
                      {pkg.price && (
                        <p className="text-xs font-bold text-brand-700">
                          ₹{pkg.price.toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-6 text-center">
              <p className="text-sm text-ink-600">
                Packages coming soon.
              </p>
              <Link
                href="/contact?interest=custom-trip"
                onClick={onClose}
                className="mt-3 inline-flex items-center gap-1 rounded-full bg-brand-700 px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-600 transition"
              >
                Plan a Custom Trip
              </Link>
            </div>
          )}
        </div>

        {/* Column C: Featured card */}
        <div className="border-l border-line bg-brand-950/5 p-4 flex flex-col gap-3">
          <p className="text-[10px] font-bold tracking-widest text-brand-500 uppercase">
            Featured
          </p>
          <FeaturedCard card={featuredCard} />
          <Link
            href="/contact?interest=custom-trip"
            onClick={onClose}
            className="mt-auto text-center text-xs font-semibold text-brand-600 hover:text-brand-800 transition"
          >
            Build your own itinerary →
          </Link>
        </div>
      </div>
    </MegaMenuPanel>
  );
}

// ---------------------------------------------------------------------------
// Honeymoon mega menu panel
// ---------------------------------------------------------------------------

export function HoneymoonMegaMenu({
  id,
  triggerId,
  open,
  onClose,
  destinationGroups,
  packageItems,
  featuredCard,
}: {
  id: string;
  triggerId?: string;
  open: boolean;
  onClose: () => void;
  destinationGroups: NavDestinationGroup[];
  packageItems: NavPackageItem[];
  featuredCard: NavFeaturedCard;
}) {
  return (
    <MegaMenuPanel
      id={id}
      triggerId={triggerId}
      open={open}
      onClose={onClose}
      className="w-[780px] max-w-[calc(100vw-2rem)]"
    >
      <div className="grid grid-cols-[1fr_210px]">
        {/* Left */}
        <div className="p-6">
          <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-brand-600 uppercase">
                Honeymoon Escapes
              </p>
              <p className="text-sm font-bold text-ink-900 mt-0.5">Romance Journeys</p>
            </div>
            <Link
              href="/packages?category=honeymoon"
              onClick={onClose}
              className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition"
            >
              All packages
              <svg viewBox="0 0 12 12" fill="none" className="size-2.5" aria-hidden="true">
                <path d="m4 2 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-8">
            {/* Destination groups */}
            <div>
              <p className="text-[10px] font-black tracking-widest text-brand-400 uppercase mb-3">
                Destinations
              </p>
              {destinationGroups.map((group) => (
                <div key={group.region} className="mb-4">
                  <p className="text-[10px] font-bold text-ink-700 mb-1.5">{group.region}</p>
                  <ul className="space-y-1">
                    {group.destinations.map((dest) => (
                      <li key={dest.slug}>
                        <Link
                          href={dest.href}
                          onClick={onClose}
                          className="flex items-center gap-1.5 text-sm text-ink-600 hover:text-brand-700 transition-colors"
                        >
                          <span className="size-1 shrink-0 rounded-full bg-brand-300" aria-hidden="true" />
                          {dest.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Package items */}
            <div>
              <p className="text-[10px] font-black tracking-widest text-brand-400 uppercase mb-3">
                Packages
              </p>
              {packageItems.length > 0 ? (
                <ul className="space-y-2">
                  {packageItems.map((pkg) => (
                    <li key={pkg.slug}>
                      <Link
                        href={pkg.href}
                        onClick={onClose}
                        className="group block rounded-xl p-2 hover:bg-brand-50 transition"
                      >
                        <p className="text-sm font-bold text-ink-900 group-hover:text-brand-700 transition">
                          {pkg.title}
                        </p>
                        <p className="text-xs text-ink-500 mt-0.5">
                          {pkg.destination}
                          {pkg.nights ? ` · ${pkg.nights}N/${pkg.days}D` : ""}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-ink-600">Coming soon</p>
              )}
            </div>
          </div>

          {/* Footer actions */}
          <div className="mt-4 pt-4 border-t border-line flex flex-wrap gap-2">
            <Link
              href="/contact?interest=honeymoon"
              onClick={onClose}
              className="inline-flex items-center gap-1 rounded-full bg-brand-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-600 transition"
            >
              Plan a Honeymoon
            </Link>
            <Link
              href="/packages?category=honeymoon"
              onClick={onClose}
              className="inline-flex items-center rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-700 hover:border-brand-300 hover:text-brand-700 transition"
            >
              Browse all
            </Link>
          </div>
        </div>

        {/* Right: featured card */}
        <div className="border-l border-line bg-brand-950/5 p-4 flex flex-col gap-3">
          <p className="text-[10px] font-bold tracking-widest text-brand-500 uppercase">
            Featured
          </p>
          <FeaturedCard card={featuredCard} />
        </div>
      </div>
    </MegaMenuPanel>
  );
}

// ---------------------------------------------------------------------------
// Services mini-panel
// ---------------------------------------------------------------------------

export function ServicesMegaMenu({
  id,
  triggerId,
  open,
  onClose,
  serviceGroups,
}: {
  id: string;
  triggerId?: string;
  open: boolean;
  onClose: () => void;
  serviceGroups: NavServiceGroup[];
}) {
  return (
    <MegaMenuPanel
      id={id}
      triggerId={triggerId}
      open={open}
      onClose={onClose}
      className="w-[580px] max-w-[calc(100vw-2rem)]"
    >
      <div className="p-6">
        <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-brand-600 uppercase">
              Travel Services
            </p>
            <p className="text-sm font-bold text-ink-900 mt-0.5">Everything your trip needs</p>
          </div>
          <Link
            href="/services"
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition"
          >
            All services
            <svg viewBox="0 0 12 12" fill="none" className="size-2.5" aria-hidden="true">
              <path d="m4 2 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-x-6">
          {serviceGroups.map((group) => (
            <div key={group.group}>
              <p className="text-[10px] font-black tracking-widest text-brand-400 uppercase mb-2">
                {group.group}
              </p>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="group block"
                    >
                      <p className="text-sm font-semibold text-ink-800 group-hover:text-brand-700 transition">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-ink-500 mt-0.5 leading-relaxed">
                        {item.short}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-line">
          <Link
            href="/contact?interest=custom-trip"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2 text-xs font-bold text-white hover:bg-brand-600 transition"
          >
            Speak with a travel specialist
            <svg viewBox="0 0 12 12" fill="none" className="size-2.5" aria-hidden="true">
              <path d="m4 2 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </MegaMenuPanel>
  );
}
