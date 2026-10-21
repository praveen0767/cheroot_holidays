import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const enPath = path.resolve(__dirname, "../messages/en.json");
const taPath = path.resolve(__dirname, "../messages/ta.json");

function loadJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[Error reading/parsing ${filePath}]:`, err.message);
    process.exit(1);
  }
}

function flattenKeys(obj, prefix = "") {
  let res = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(res, flattenKeys(value, fullKey));
    } else {
      res[fullKey] = value;
    }
  }
  return res;
}

function extractPlaceholders(str) {
  if (typeof str !== "string") return [];
  const matches = str.match(/\{([^}]+)\}/g);
  return matches ? matches.sort() : [];
}

console.log("=========================================");
console.log("  TRANSLATION VALIDATION SUITE (EN / TA) ");
console.log("=========================================\n");

const en = loadJson(enPath);
const ta = loadJson(taPath);

const enFlat = flattenKeys(en);
const taFlat = flattenKeys(ta);

const enKeys = new Set(Object.keys(enFlat));
const taKeys = new Set(Object.keys(taFlat));

let hasErrors = false;

// 1. Missing keys in Tamil
const missingInTa = [...enKeys].filter((k) => !taKeys.has(k));
if (missingInTa.length > 0) {
  hasErrors = true;
  console.error(`❌ ${missingInTa.length} keys missing in Tamil (messages/ta.json):`);
  missingInTa.forEach((k) => console.error(`   - ${k}`));
} else {
  console.log("✅ All English keys present in Tamil.");
}

// 2. Extra/Missing keys in English
const missingInEn = [...taKeys].filter((k) => !enKeys.has(k));
if (missingInEn.length > 0) {
  hasErrors = true;
  console.error(`❌ ${missingInEn.length} keys in Tamil missing in English (messages/en.json):`);
  missingInEn.forEach((k) => console.error(`   - ${k}`));
} else {
  console.log("✅ All Tamil keys present in English.");
}

// 3. Empty string translations
let emptyCount = 0;
for (const [k, v] of Object.entries(enFlat)) {
  if (typeof v === "string" && !v.trim()) {
    hasErrors = true;
    emptyCount++;
    console.error(`❌ Empty English string for key: ${k}`);
  }
}
for (const [k, v] of Object.entries(taFlat)) {
  if (typeof v === "string" && !v.trim()) {
    hasErrors = true;
    emptyCount++;
    console.error(`❌ Empty Tamil string for key: ${k}`);
  }
}
if (emptyCount === 0) {
  console.log("✅ No empty translation values found.");
}

// 4. Interpolation placeholder mismatches
let placeholderMismatches = 0;
for (const k of enKeys) {
  if (taKeys.has(k)) {
    const enPlaceholders = extractPlaceholders(enFlat[k]);
    const taPlaceholders = extractPlaceholders(taFlat[k]);
    if (JSON.stringify(enPlaceholders) !== JSON.stringify(taPlaceholders)) {
      hasErrors = true;
      placeholderMismatches++;
      console.error(
        `❌ Placeholder mismatch for key "${k}":\n` +
        `     EN: [${enPlaceholders.join(", ")}]\n` +
        `     TA: [${taPlaceholders.join(", ")}]`
      );
    }
  }
}
if (placeholderMismatches === 0) {
  console.log("✅ All interpolation placeholders match perfectly.");
}

console.log("\nSummary:");
console.log(`- Total English keys: ${enKeys.size}`);
console.log(`- Total Tamil keys:   ${taKeys.size}`);

if (hasErrors) {
  console.error("\n❌ Translation validation failed with errors.");
  process.exit(1);
} else {
  console.log("\n🎉 Translation validation PASSED successfully!\n");
}
