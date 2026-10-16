import Image from "next/image";
import Link from "next/link";
import type { TravelService } from "@/data/services";

/**
 * Service card used on dark surfaces (home services strip).
 */
export default function ServiceCard({ service }: { service: TravelService }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/15 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:ring-white/30"
    >
      <div className="relative aspect-3/2 overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-white">{service.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-brand-100/75">
          {service.short}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-300 transition-colors group-hover:text-white">
          Learn more
          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-0.5"
          >
            <path
              d="M4 10h11m0 0-4-4m4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
