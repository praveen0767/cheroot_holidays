/**
 * Normalization utilities for place search.
 * Deterministic, diacritic-insensitive, punctuation-insensitive string normalization.
 */

export function normalizePlaceText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9\s\u0B80-\u0BFF]/g, " ")   // replace punctuation with spaces, preserving Tamil script
    .replace(/\s+/g, " ")           // collapse spaces
    .trim();
}

export function tokenizePlaceText(text: string): string[] {
  const normalized = normalizePlaceText(text);
  if (!normalized) return [];
  return normalized.split(" ").filter((t) => t.length > 0);
}

/**
 * Checks if a string contains another string as a whole word or prefix.
 */
export function matchesQueryTokens(target: string, queryTokens: string[]): boolean {
  if (queryTokens.length === 0) return true;
  const targetNorm = normalizePlaceText(target);
  const targetTokens = tokenizePlaceText(target);

  return queryTokens.every((qToken) => {
    // 1. Substring in normalized string
    if (targetNorm.includes(qToken)) return true;
    // 2. Prefix match on any target token
    return targetTokens.some((tToken) => tToken.startsWith(qToken));
  });
}
