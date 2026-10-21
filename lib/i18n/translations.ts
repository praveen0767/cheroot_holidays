import type { Locale, TranslationParams } from "./types";
import enMessages from "@/messages/en.json";
import taMessages from "@/messages/ta.json";

const DICTIONARIES = {
  en: enMessages,
  ta: taMessages,
};

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;

  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return typeof current === "string" ? current : undefined;
}

export function formatTemplate(template: string, params?: TranslationParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    if (key in params) {
      return String(params[key]);
    }
    return match;
  });
}

export function translate(
  locale: Locale,
  key: string,
  params?: TranslationParams,
): string {
  const dict = DICTIONARIES[locale] || DICTIONARIES.en;
  let text = getNestedValue(dict, key);

  // Fallback to English if missing in target locale
  if (text === undefined && locale !== "en") {
    text = getNestedValue(DICTIONARIES.en, key);
  }

  if (text === undefined) {
    return key;
  }

  return formatTemplate(text, params);
}

export function getDictionary(locale: Locale) {
  return DICTIONARIES[locale] || DICTIONARIES.en;
}
