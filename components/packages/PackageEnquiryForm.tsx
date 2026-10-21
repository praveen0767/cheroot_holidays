"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface PackageEnquiryFormProps {
  pkg: {
    slug: string;
    title: string;
    destination: string;
  };
}

// ---------------------------------------------------------------------------
// Shared form-control classes
// ---------------------------------------------------------------------------
const inputBase =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 " +
  "placeholder:text-ink-600/60 focus:border-brand-500 focus:outline-none focus:ring-2 " +
  "focus:ring-brand-500/20 transition-colors duration-150";

export default function PackageEnquiryForm({ pkg }: PackageEnquiryFormProps) {
  const { locale, t } = useTranslation();
  const [passengers, setPassengers] = useState(2);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enquiryRef, setEnquiryRef] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const increment = () => setPassengers((c) => Math.min(c + 1, 30));
  const decrement = () => setPassengers((c) => Math.max(c - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError(
        locale === "ta"
          ? "தொடர்புகொள்ள உங்கள் ஒப்புதலை உறுதிப்படுத்தவும்."
          : "Please confirm your consent to be contacted.",
      );
      return;
    }
    const phoneClean = phone.trim();
    if (!/^\+?[1-9]\d{7,14}$/.test(phoneClean)) {
      setError(
        locale === "ta"
          ? "நாட்டு குறியீட்டுடன் சரியான தொலைபேசி எண்ணை உள்ளிடவும் (எ.கா: +918123456789)"
          : "Enter a valid phone number with country code, e.g. +918123456789",
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: pkg.slug,
          passengers,
          phone: phoneClean,
          name: name || undefined,
          travelDate: date || undefined,
          notes: notes || undefined,
          consent,
          locale,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || (locale === "ta" ? "விசாரணையை சமர்ப்பிக்க முடியவில்லை" : "Submission failed"));
      }
      setEnquiryRef(data.reference ?? null);
      setIsPreview(Boolean(data.preview));
      setMessage(
        data.preview
          ? locale === "ta"
            ? "முன்னோட்ட முறையில் விசாரணை பெறப்பட்டது! எங்கள் குழு உங்கள் கோரிக்கையை பதிவு செய்துள்ளது."
            : "Enquiry received in preview mode! Our team has recorded your request."
          : t("enquiry.successMessage"),
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("enquiry.errorMessage");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (message) {
    return (
      <div
        id="enquiry-success"
        className="rounded-3xl border border-brand-200 bg-brand-50 p-6 space-y-3"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-500 text-white text-lg">
            {isPreview ? "📋" : "✓"}
          </span>
          <div>
            <p className="font-bold text-brand-900">
              {isPreview
                ? locale === "ta"
                  ? "முன்னோட்ட முறை"
                  : "Preview Mode"
                : t("enquiry.successTitle")}
            </p>
            {enquiryRef && (
              <p className="mt-0.5 font-mono text-xs font-semibold text-brand-700 bg-brand-100 inline-block px-2 py-0.5 rounded">
                {enquiryRef}
              </p>
            )}
          </div>
        </div>
        <p className="text-sm text-ink-700 leading-relaxed">{message}</p>
        {isPreview && (
          <p className="text-xs text-ink-500 italic border-t border-brand-200 pt-3">
            {locale === "ta"
              ? "உள்ளூர் முன்னோட்டம் மட்டுமே — வெளிப்புற வாட்ஸ்அப் செய்தி எதுவும் அனுப்பப்படவில்லை."
              : "Local preview only — no external WhatsApp message was transmitted."}
          </p>
        )}
      </div>
    );
  }

  // ── Form state ─────────────────────────────────────────────────────────────
  return (
    <form
      id="enquiry-form"
      onSubmit={handleSubmit}
      className="rounded-3xl border border-line bg-white p-6 shadow-sm space-y-5"
    >
      {/* Header */}
      <div className="border-b border-line pb-4">
        <h2 className="text-base font-bold text-ink-900">
          {t("enquiry.title", { title: pkg.title })}
        </h2>
        <p className="mt-1 text-xs text-ink-600">
          {pkg.destination} ·{" "}
          {locale === "ta"
            ? "உங்கள் விவரங்களை பகிருங்கள், எங்கள் பயணக் குழுவினர் தனிப்பயன் கட்டண விவரங்களுடன் தொடர்புகொள்வார்கள்."
            : "Share your details and our travel team will reach out with a personalised quote."}
        </p>
      </div>

      {/* Passenger stepper */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-ink-600 mb-2">
          {t("enquiry.passengers")}
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={decrement}
            disabled={passengers <= 1}
            aria-label={
              locale === "ta"
                ? "பயணிகள் எண்ணிக்கையைக் குறைக்க"
                : "Decrease passenger count"
            }
            className={cn(
              "grid size-9 place-items-center rounded-full border border-line text-ink-700 transition",
              "hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50",
              passengers <= 1 && "opacity-40 cursor-not-allowed",
            )}
          >
            <svg viewBox="0 0 12 12" fill="none" className="size-3.5" aria-hidden="true">
              <path d="M2 6h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <span className="w-8 text-center text-lg font-bold text-ink-900">
            {passengers}
          </span>
          <button
            type="button"
            onClick={increment}
            disabled={passengers >= 30}
            aria-label={
              locale === "ta"
                ? "பயணிகள் எண்ணிக்கையை அதிகரிக்க"
                : "Increase passenger count"
            }
            className={cn(
              "grid size-9 place-items-center rounded-full border border-line text-ink-700 transition",
              "hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50",
              passengers >= 30 && "opacity-40 cursor-not-allowed",
            )}
          >
            <svg viewBox="0 0 12 12" fill="none" className="size-3.5" aria-hidden="true">
              <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <span className="text-sm text-ink-600">
            {passengers === 1
              ? locale === "ta"
                ? "நபர்"
                : "person"
              : locale === "ta"
                ? "நபர்கள்"
                : "people"}
          </span>
        </div>
      </div>

      {/* Name */}
      <div>
        <label
          htmlFor="enq-name"
          className="block text-xs font-semibold uppercase tracking-widest text-ink-600 mb-1.5"
        >
          {t("enquiry.name")}
        </label>
        <input
          id="enq-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("enquiry.namePlaceholder")}
          className={inputBase}
        />
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="enq-phone"
          className="block text-xs font-semibold uppercase tracking-widest text-ink-600 mb-1.5"
        >
          {t("enquiry.phone")}
        </label>
        <input
          id="enq-phone"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t("enquiry.phonePlaceholder")}
          className={inputBase}
        />
        <p className="mt-1 text-xs text-ink-600/70">
          {locale === "ta"
            ? "நாட்டு குறியீட்டுடன் சேர்க்கவும், எ.கா: இந்தியாவிற்கு +91"
            : "Include country code, e.g. +91 for India"}
        </p>
      </div>

      {/* Travel date */}
      <div>
        <label
          htmlFor="enq-date"
          className="block text-xs font-semibold uppercase tracking-widest text-ink-600 mb-1.5"
        >
          {t("enquiry.travelDate")}
        </label>
        <input
          id="enq-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputBase}
        />
      </div>

      {/* Notes */}
      <div>
        <label
          htmlFor="enq-notes"
          className="block text-xs font-semibold uppercase tracking-widest text-ink-600 mb-1.5"
        >
          {t("enquiry.notes")}
        </label>
        <textarea
          id="enq-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t("enquiry.notesPlaceholder")}
          className={inputBase}
        />
      </div>

      {/* Consent */}
      <label
        htmlFor="enq-consent"
        className="flex items-start gap-3 cursor-pointer"
      >
        <input
          id="enq-consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded border-line accent-brand-600"
        />
        <span className="text-xs text-ink-600 leading-relaxed">
          {t("enquiry.consent")}
        </span>
      </label>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        variant="primary"
        className="w-full"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {t("enquiry.sending")}
          </span>
        ) : (
          t("enquiry.send")
        )}
      </Button>

      <p className="text-center text-xs text-ink-600/60">
        {locale === "ta"
          ? "தேவையற்ற விளம்பரச் செய்திகள் இல்லை. உங்கள் விசாரணை குறித்து மட்டுமே தொடர்புகொள்வோம்."
          : "No spam. We'll only reach out about your enquiry."}
      </p>
    </form>
  );
}
