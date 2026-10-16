"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { NAV, CONTACT } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Logo from "@/components/layout/Logo";
import MobileMenu from "@/components/layout/MobileMenu";
import { cn } from "@/lib/utils";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "glass border-b border-line/70 shadow-[0_10px_30px_-20px_rgba(11,27,51,0.4)]"
            : "bg-transparent",
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-4 md:h-20">
          <Logo tone={scrolled ? "dark" : "light"} />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.label} className="group relative">
                  <Link
                    href={item.href ?? "#"}
                    className={cn(
                      "relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors after:absolute after:-bottom-0.5 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-brand-500 after:transition-all after:duration-200 group-hover:after:w-6 group-focus-within:after:w-6",
                      scrolled
                        ? "text-ink-700 hover:text-brand-700"
                        : "text-white/90 hover:text-white",
                    )}
                  >
                    {item.label}
                    <svg viewBox="0 0 12 12" fill="none" className="size-3 opacity-70 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180">
                      <path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>

                  <div className="invisible absolute left-1/2 top-full z-10 w-56 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="overflow-hidden rounded-2xl border border-line/80 bg-surface/95 p-2 shadow-xl shadow-brand-900/10 backdrop-blur-md">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-brand-50 hover:text-brand-700"
                        >
                          {child.label}
                          <span className="text-brand-400">→</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href ?? "#"}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors after:absolute after:-bottom-0.5 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-brand-500 after:transition-all after:duration-200 hover:after:w-6",
                    pathname === item.href
                      ? afterAlways(scrolled)
                      : scrolled
                        ? "text-ink-700 hover:text-brand-700"
                        : "text-white/90 hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={`tel:${CONTACT.phoneHref}`}
              className={cn(
                "flex items-center gap-1.5 text-sm font-semibold transition-colors",
                scrolled ? "text-ink-700 hover:text-brand-700" : "text-white/90 hover:text-white",
              )}
            >
              <svg viewBox="0 0 20 20" fill="none" className="size-4">
                <path
                  d="M4.2 3.5h3l1.2 3-1.7 1.3a10 10 0 0 0 4.5 4.5l1.3-1.7 3 1.2v3a1.5 1.5 0 0 1-1.6 1.5A13.5 13.5 0 0 1 2.7 5.1 1.5 1.5 0 0 1 4.2 3.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              Call Us
            </a>
            <ButtonLink href="/contact" size="sm">
              Plan a Trip
            </ButtonLink>
          </div>

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className={cn(
              "grid size-11 place-items-center rounded-full transition lg:hidden",
              scrolled
                ? "text-ink-900 hover:bg-surface-soft"
                : "text-white hover:bg-white/10",
            )}
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-6">
              {menuOpen ? (
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </Container>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}

function afterAlways(scrolled: boolean) {
  return scrolled
    ? "text-brand-700 after:w-6 after:bg-brand-500"
    : "text-white after:w-6 after:bg-white";
}
