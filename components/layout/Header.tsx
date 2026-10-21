"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Logo from "@/components/layout/Logo";
import MobileMenu from "@/components/layout/MobileMenu";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import {
  DestinationsMegaMenu,
  PackagesMegaMenu,
  HoneymoonMegaMenu,
  ServicesMegaMenu,
} from "@/components/layout/MegaMenuPanels";
import { cn } from "@/lib/utils";
import {
  JOURNEY_CATEGORIES,
  getDestinationGroups,
  getPackageNavItems,
  getHoneymoonDestinationGroups,
  getServiceNavGroups,
  getDestinationsFeaturedCard,
  getPackagesFeaturedCard,
  getHoneymoonFeaturedCard,
} from "@/data/mega-navigation";

// ---------------------------------------------------------------------------
// Derive data once (module-level — stable references, no runtime fetch)
// ---------------------------------------------------------------------------

const destinationGroups = getDestinationGroups();
const destinationFeaturedCard = getDestinationsFeaturedCard();
const honeymoonDestGroups = getHoneymoonDestinationGroups();
const honeymoonFeaturedCard = getHoneymoonFeaturedCard();
const serviceGroups = getServiceNavGroups();

// Packages are category-specific — derived per-render but memoized
const pkgCategories = JOURNEY_CATEGORIES.filter((c) => c.key !== "custom");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MenuKey = "destinations" | "packages" | "honeymoon" | "services" | null;

// ---------------------------------------------------------------------------
// NavTrigger — desktop nav button that opens a mega menu
// ---------------------------------------------------------------------------

function NavTrigger({
  label,
  isOpen,
  isHeaderSolid,
  pathname,
  relatedPaths,
  onOpen,
  onToggle,
  onScheduleClose,
  onCancelClose,
  triggerId,
  panelId,
}: {
  label: string;
  isOpen: boolean;
  isHeaderSolid: boolean;
  pathname: string;
  relatedPaths: string[];
  onOpen: () => void;
  onToggle: () => void;
  onScheduleClose: () => void;
  onCancelClose: () => void;
  triggerId: string;
  panelId: string;
}) {
  const isActive = relatedPaths.some((p) => pathname.startsWith(p));

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        onCancelClose();
        onOpen();
      }}
      onMouseLeave={onScheduleClose}
    >
      <button
        id={triggerId}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className={cn(
          "relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 cursor-pointer",
          "after:absolute after:-bottom-0.5 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:transition-all after:duration-200",
          isOpen || isActive ? "after:w-6" : "",
          isHeaderSolid
            ? isOpen || isActive
              ? "text-brand-700 after:bg-brand-500"
              : "text-ink-700 hover:text-brand-700"
            : isOpen || isActive
              ? "text-white after:bg-white"
              : "text-white/90 hover:text-white",
        )}
      >
        <span>{label}</span>
        <svg
          viewBox="0 0 12 12"
          fill="none"
          className={cn(
            "size-3 opacity-70 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          aria-hidden="true"
        >
          <path
            d="m3 4.5 3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Header
// ---------------------------------------------------------------------------

export default function Header() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKey>(null);
  const [packageCategory, setPackageCategory] = useState<string>("international");
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derived package items for active category
  const packageItems = getPackageNavItems(
    packageCategory as "international" | "domestic" | "honeymoon",
    5,
  );
  const packageFeaturedCard = getPackagesFeaturedCard(
    packageCategory as "international" | "domestic" | "honeymoon",
  );

  // ── Scroll handler
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Centralized hover/close management
  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 180);
  }, [cancelClose]);

  const openMenu = useCallback(
    (key: MenuKey) => {
      cancelClose();
      setActiveMenu(key);
    },
    [cancelClose],
  );

  const closeMenu = useCallback(() => {
    cancelClose();
    setActiveMenu(null);
  }, [cancelClose]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // ── Close menu on route change (adjusting state during render)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (activeMenu !== null) setActiveMenu(null);
    if (mobileOpen) setMobileOpen(false);
  }

  // ── Outside click
  useEffect(() => {
    if (!activeMenu) return;
    const handler = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [activeMenu, closeMenu]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Whether header should have opaque/glass background
  // Package detail pages start directly with breadcrumbs on a light surface,
  // so the header must always have a readable solid background and dark text.
  const isPackageDetail =
    pathname.startsWith("/packages/") && pathname !== "/packages";
  const isHeaderSolid = scrolled || Boolean(activeMenu) || isPackageDetail;
  const overlayActive = Boolean(activeMenu);

  return (
    <>
      {/* Overlay that dims page behind open mega menu */}
      <div
        aria-hidden="true"
        onClick={closeMenu}
        className={cn(
          "fixed inset-0 z-40 bg-brand-950/25 backdrop-blur-[1px] transition-all duration-200",
          overlayActive ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <header
        ref={headerRef}
        onMouseLeave={scheduleClose}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          isHeaderSolid
            ? "bg-white/95 backdrop-blur-md border-b border-line/70 shadow-[0_4px_20px_-10px_rgba(11,27,51,0.2)]"
            : "bg-transparent",
        )}
      >
        <Container size="wide" className="relative flex h-16 items-center justify-between gap-4 md:h-20">
          {/* Logo */}
          <Logo tone={isHeaderSolid ? "dark" : "light"} />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary navigation">
            {/* Home */}
            <Link
              href="/"
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200",
                "after:absolute after:-bottom-0.5 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:transition-all after:duration-200 hover:after:w-6",
                pathname === "/"
                  ? isHeaderSolid
                    ? "text-brand-700 after:w-6 after:bg-brand-500"
                    : "text-white after:w-6 after:bg-white"
                  : isHeaderSolid
                    ? "text-ink-700 hover:text-brand-700"
                    : "text-white/90 hover:text-white",
              )}
            >
              {t("nav.home")}
            </Link>

            {/* Destinations mega menu trigger */}
            <NavTrigger
              label={t("nav.destinations")}
              isOpen={activeMenu === "destinations"}
              isHeaderSolid={isHeaderSolid}
              pathname={pathname}
              relatedPaths={["/destinations"]}
              onOpen={() => openMenu("destinations")}
              onToggle={() =>
                activeMenu === "destinations" ? closeMenu() : openMenu("destinations")
              }
              onScheduleClose={scheduleClose}
              onCancelClose={cancelClose}
              triggerId="nav-destinations-trigger"
              panelId="nav-destinations-panel"
            />

            {/* Packages mega menu trigger */}
            <NavTrigger
              label={t("nav.packages")}
              isOpen={activeMenu === "packages"}
              isHeaderSolid={isHeaderSolid}
              pathname={pathname}
              relatedPaths={["/packages"]}
              onOpen={() => openMenu("packages")}
              onToggle={() =>
                activeMenu === "packages" ? closeMenu() : openMenu("packages")
              }
              onScheduleClose={scheduleClose}
              onCancelClose={cancelClose}
              triggerId="nav-packages-trigger"
              panelId="nav-packages-panel"
            />

            {/* Honeymoon mega menu trigger */}
            <NavTrigger
              label={t("nav.honeymoon")}
              isOpen={activeMenu === "honeymoon"}
              isHeaderSolid={isHeaderSolid}
              pathname={pathname}
              relatedPaths={["/packages?category=honeymoon"]}
              onOpen={() => openMenu("honeymoon")}
              onToggle={() =>
                activeMenu === "honeymoon" ? closeMenu() : openMenu("honeymoon")
              }
              onScheduleClose={scheduleClose}
              onCancelClose={cancelClose}
              triggerId="nav-honeymoon-trigger"
              panelId="nav-honeymoon-panel"
            />

            {/* Services mega menu trigger */}
            <NavTrigger
              label={t("nav.services")}
              isOpen={activeMenu === "services"}
              isHeaderSolid={isHeaderSolid}
              pathname={pathname}
              relatedPaths={["/services"]}
              onOpen={() => openMenu("services")}
              onToggle={() =>
                activeMenu === "services" ? closeMenu() : openMenu("services")
              }
              onScheduleClose={scheduleClose}
              onCancelClose={cancelClose}
              triggerId="nav-services-trigger"
              panelId="nav-services-panel"
            />

            {/* Direct links */}
            {[
              { label: t("nav.about"), href: "/about" },
              { label: t("nav.contact"), href: "/contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200",
                  "after:absolute after:-bottom-0.5 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:transition-all after:duration-200 hover:after:w-6",
                  pathname === item.href
                    ? isHeaderSolid
                      ? "text-brand-700 after:w-6 after:bg-brand-500"
                      : "text-white after:w-6 after:bg-white"
                    : isHeaderSolid
                      ? "text-ink-700 hover:text-brand-700"
                      : "text-white/90 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher tone={isHeaderSolid ? "dark" : "light"} />
            <ButtonLink href="/contact" size="sm">
              {t("nav.planTrip")}
            </ButtonLink>
          </div>

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className={cn(
              "grid size-11 place-items-center rounded-full transition lg:hidden cursor-pointer",
              isHeaderSolid
                ? "text-ink-900 hover:bg-surface-soft"
                : "text-white hover:bg-white/10",
            )}
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-6">
              {mobileOpen ? (
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>

          {/* Desktop Floating Mega Menu Panels (anchored directly to Container, horizontally centered) */}
          <div
            className="hidden lg:block pointer-events-none"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <DestinationsMegaMenu
              id="nav-destinations-panel"
              triggerId="nav-destinations-trigger"
              open={activeMenu === "destinations"}
              onClose={closeMenu}
              destinationGroups={destinationGroups}
              featuredCard={destinationFeaturedCard}
            />

            <PackagesMegaMenu
              id="nav-packages-panel"
              triggerId="nav-packages-trigger"
              open={activeMenu === "packages"}
              onClose={closeMenu}
              categories={pkgCategories}
              activeCategory={packageCategory}
              onCategoryChange={setPackageCategory}
              packageItems={packageItems}
              featuredCard={packageFeaturedCard}
            />

            <HoneymoonMegaMenu
              id="nav-honeymoon-panel"
              triggerId="nav-honeymoon-trigger"
              open={activeMenu === "honeymoon"}
              onClose={closeMenu}
              destinationGroups={honeymoonDestGroups}
              packageItems={getPackageNavItems("honeymoon", 4)}
              featuredCard={honeymoonFeaturedCard}
            />

            <ServicesMegaMenu
              id="nav-services-panel"
              triggerId="nav-services-trigger"
              open={activeMenu === "services"}
              onClose={closeMenu}
              serviceGroups={serviceGroups}
            />
          </div>
        </Container>
      </header>

      <MobileMenu open={mobileOpen} onClose={closeMobile} />
    </>
  );
}
