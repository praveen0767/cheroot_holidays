"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { Locale, TranslationParams } from "./types";
import { translate } from "./translations";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: TranslationParams) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";

  try {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get("lang");
    if (langParam === "ta" || langParam === "en") {
      return langParam;
    }

    const cookieMatch = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
    if (cookieMatch && (cookieMatch[1] === "ta" || cookieMatch[1] === "en")) {
      return cookieMatch[1] as Locale;
    }
  } catch {
    // fallback
  }

  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);

    if (typeof window !== "undefined") {
      try {
        // 1. Save cookie for 1 year
        document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`;

        // 2. Update document lang
        document.documentElement.lang = newLocale;

        // 3. Sync URL search params without reload
        const url = new URL(window.location.href);
        if (newLocale === "ta") {
          url.searchParams.set("lang", "ta");
        } else {
          url.searchParams.delete("lang");
        }
        window.history.replaceState(null, "", url.toString());
      } catch {
        // ignore storage errors
      }
    }
  }, []);

  // Sync html lang attribute on mount & change
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const t = useCallback(
    (key: string, params?: TranslationParams) => {
      return translate(locale, key, params);
    },
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, setLocale, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
