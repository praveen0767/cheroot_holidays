"use client";

import { useTranslation } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  tone?: "light" | "dark";
}

export default function LanguageSwitcher({
  className,
  tone = "dark",
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useTranslation();

  return (
    <div
      role="group"
      aria-label="Language selection / மொழி தேர்வு"
      className={cn(
        "inline-flex items-center rounded-full p-1 text-xs font-bold transition-colors select-none",
        tone === "light"
          ? "bg-white/15 border border-white/20 text-white backdrop-blur-md"
          : "bg-surface-soft border border-line text-ink-700",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        aria-label="English language"
        className={cn(
          "rounded-full px-2.5 py-1 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
          locale === "en"
            ? "bg-brand-600 text-white shadow-sm font-extrabold"
            : tone === "light"
              ? "text-white/70 hover:text-white"
              : "text-ink-600 hover:text-ink-900",
        )}
      >
        EN
      </button>

      <span
        className={cn(
          "px-0.5 text-[10px] opacity-40",
          tone === "light" ? "text-white" : "text-ink-400",
        )}
        aria-hidden="true"
      >
        |
      </span>

      <button
        type="button"
        onClick={() => setLocale("ta")}
        aria-pressed={locale === "ta"}
        aria-label="தமிழ் மொழி (Tamil language)"
        className={cn(
          "rounded-full px-2.5 py-1 font-serif text-[11px] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
          locale === "ta"
            ? "bg-brand-600 text-white shadow-sm font-bold"
            : tone === "light"
              ? "text-white/70 hover:text-white"
              : "text-ink-600 hover:text-ink-900",
        )}
      >
        தமிழ்
      </button>
    </div>
  );
}
