import Image from "next/image";
import Link from "next/link";
import type { TravelPackage } from "@/data/packages";
import Badge from "@/components/ui/Badge";
import { cn, formatINR } from "@/lib/utils";

export default function PackageCard({
  pkg,
  className,
}: {
  pkg: TravelPackage;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-line/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_28px_60px_-38px_rgba(11,27,51,0.7)]",
        className,
      )}
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={pkg.image}
          alt={`${pkg.title} — ${pkg.destination}`}
          fill
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 30vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/35 to-transparent" />

        {pkg.badge && (
          <div className="absolute top-3 left-3">
            <Badge tone="glass">{pkg.badge}</Badge>
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          aria-label={`Save ${pkg.title} to wishlist`}
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/85 text-ink-600 backdrop-blur-sm transition hover:bg-white hover:text-rose-500"
        >
          <svg viewBox="0 0 20 20" fill="none" className="size-4.5">
            <path
              d="M10 16.5S3.5 12.7 3.5 7.9A3.6 3.6 0 0 1 10 5.8a3.6 3.6 0 0 1 6.5 2.1c0 4.8-6.5 8.6-6.5 8.6Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wider text-brand-600 uppercase">
              {pkg.destination}
            </p>
            <h3 className="mt-1 truncate text-lg font-bold text-ink-900">
              {pkg.title}
            </h3>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-surface-soft px-2 py-1 text-xs font-bold text-ink-900 ring-1 ring-line">
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5 text-accent" aria-hidden="true">
              <path d="m10 1.8 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8L10 1.8Z" />
            </svg>
            {pkg.rating.toFixed(1)}
          </span>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-sm text-ink-600">
          <svg viewBox="0 0 20 20" fill="none" className="size-4 text-brand-500" aria-hidden="true">
            <rect x="3" y="4.5" width="14" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 8.5h14M7 3v3M13 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {pkg.nights} Nights · {pkg.days} Days
          <span className="mx-1 text-line-strong">|</span>
          {pkg.reviews} reviews
        </p>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {pkg.highlights.map((h) => (
            <li
              key={h}
              className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
            >
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div className="min-w-0">
            <p className="text-xs text-ink-600">From</p>
            <p className="text-xl font-extrabold whitespace-nowrap text-ink-900">
              {formatINR(pkg.price)}
            </p>
          </div>
          <Link
            href={`/packages/${pkg.slug}`}
            className="group/cta inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2.5 text-sm font-bold whitespace-nowrap text-white transition-all duration-200 hover:bg-brand-600"
          >
            Enquire Now
            <svg
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="size-4 transition-transform group-hover/cta:translate-x-0.5"
            >
              <path
                d="M4 10h11m0 0-4-4m4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
