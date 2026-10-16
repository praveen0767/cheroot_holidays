"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { NAV, CONTACT, OFFICES } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  // Close whenever the route changes
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Lock scroll + Escape to close while open
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-60 md:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-brand-900/50 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Slide-in panel */}
      <aside
        role="dialog"
        aria-label="Navigation menu"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col bg-surface shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="font-display text-lg font-extrabold text-ink-900">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-10 place-items-center rounded-full text-ink-600 transition hover:bg-surface-soft hover:text-ink-900"
          >
            <svg viewBox="0 0 20 20" fill="none" className="size-5">
              <path
                d="m5 5 10 10M15 5 5 15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-6">
          <ul className="space-y-6">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href ?? "#"}
                  className="font-display text-xl font-bold text-ink-900"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="mt-2 space-y-1 border-l-2 border-brand-100 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block py-1.5 text-[15px] text-ink-600 transition hover:text-brand-700"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li>
              <Link href="/contact" className="font-display text-xl font-bold text-ink-900">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="border-t border-line bg-surface-soft px-5 py-5">
          <div className="mb-4 flex flex-wrap gap-2 text-xs">
            {OFFICES.map((o) => (
              <span
                key={o.city}
                className="rounded-full bg-white px-2.5 py-1 font-semibold text-ink-600 ring-1 ring-line"
              >
                {o.city}
              </span>
            ))}
          </div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-700">
            <svg viewBox="0 0 20 20" fill="none" className="size-4 text-brand-600">
              <path
                d="M4.2 3.5h3l1.2 3-1.7 1.3a10 10 0 0 0 4.5 4.5l1.3-1.7 3 1.2v3a1.5 1.5 0 0 1-1.6 1.5A13.5 13.5 0 0 1 2.7 5.1 1.5 1.5 0 0 1 4.2 3.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <a href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phone}</a>
          </div>
          <ButtonLink href="/contact" className="w-full">
            Plan a Trip
          </ButtonLink>
        </div>
      </aside>
    </div>
  );
}
