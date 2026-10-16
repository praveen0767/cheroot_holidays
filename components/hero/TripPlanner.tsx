"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TRIP_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type PlannerState = { where: string; when: string; type: string };

const STEPS: { key: keyof PlannerState; prompt: string; hint: string }[] = [
  { key: "where", prompt: "Where do you want to go?", hint: "Destination or country" },
  { key: "when", prompt: "When are you travelling?", hint: "Pick a date" },
  { key: "type", prompt: "What kind of trip?", hint: "Choose a trip type" },
];

export default function TripPlanner({ className }: { className?: string }) {
  const router = useRouter();
  const [state, setState] = useState<PlannerState>({ where: "", when: "", type: "" });
  const [step, setStep] = useState(0);

  const set = (key: keyof PlannerState, value: string) =>
    setState((s) => ({ ...s, [key]: value }));

  const go = () => {
    const params = new URLSearchParams();
    if (state.where) params.set("where", state.where);
    if (state.when) params.set("when", state.when);
    if (state.type) params.set("type", state.type);
    router.push(`/packages?${params.toString()}`);
  };

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const fieldClass =
    "w-full rounded-xl border border-line bg-white px-4 text-[15px] text-ink-900 placeholder:text-ink-600/70 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  return (
    <div className={cn("w-full", className)}>
      {/* ── Mobile: single-column, bottom-sheet style stepper ── */}
      <div className="rounded-t-3xl border border-b-0 border-line bg-white p-5 shadow-[0_-10px_40px_-20px_rgba(11,27,51,0.35)] md:hidden">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1.5" aria-hidden="true">
            {STEPS.map((s, i) => (
              <span
                key={s.key}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === step ? "w-6 bg-brand-600" : "w-2.5 bg-line",
                )}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-ink-600">
            {step + 1} / {STEPS.length}
          </span>
        </div>

        <h3 className="text-lg font-bold text-ink-900">{current.prompt}</h3>
        <p className="mb-4 text-sm text-ink-600">{current.hint}</p>

        <div className="space-y-3">
          {step === 0 && (
            <input
              type="text"
              list="planner-destinations"
              value={state.where}
              onChange={(e) => set("where", e.target.value)}
              placeholder="Goa, Dubai, Bali…"
              className={cn(fieldClass, "h-13")}
              autoComplete="off"
            />
          )}
          {step === 1 && (
            <input
              type="date"
              value={state.when}
              onChange={(e) => set("when", e.target.value)}
              className={cn(fieldClass, "h-13")}
            />
          )}
          {step === 2 && (
            <div className="grid grid-cols-1 gap-2" role="radiogroup" aria-label="Trip type">
              {TRIP_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  role="radio"
                  aria-checked={state.type === t.value}
                  onClick={() => set("type", t.value)}
                  className={cn(
                    "h-12 rounded-xl border px-4 text-[15px] font-semibold transition",
                    state.type === t.value
                      ? "border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-100"
                      : "border-line bg-white text-ink-700",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Shared datalist for the destination step */}
        <datalist id="planner-destinations">
          <option value="Goa" />
          <option value="Dubai" />
          <option value="Bali" />
          <option value="Kashmir" />
          <option value="Maldives" />
          <option value="Kerala" />
        </datalist>

        <div className="mt-5 flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="h-12 flex-1 rounded-full border border-line text-sm font-semibold text-ink-700 transition hover:bg-surface-soft"
            >
              Back
            </button>
          )}
          {isLast ? (
            <button
              type="button"
              onClick={go}
              className="group h-12 flex-[2] rounded-full bg-brand-700 text-sm font-bold text-white shadow-[0_10px_25px_-10px_rgba(18,80,196,0.8)] transition hover:-translate-y-px hover:bg-brand-600"
            >
              Explore trips
              <span className="inline-block transition-transform group-hover:translate-x-0.5">
                {" "}→
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="h-12 flex-[2] rounded-full bg-brand-700 text-sm font-bold text-white shadow-[0_10px_25px_-10px_rgba(18,80,196,0.8)] transition hover:-translate-y-px hover:bg-brand-600"
            >
              Continue
            </button>
          )}
        </div>
      </div>

      {/* ── Desktop: floating horizontal search bar ── */}
      <div className="hidden rounded-3xl border border-white/60 bg-white/95 p-2.5 shadow-[0_30px_60px_-30px_rgba(7,35,90,0.55)] backdrop-blur-md md:block">
        <div className="flex items-stretch gap-1">
          <label className="flex min-w-0 flex-[1.4] flex-col justify-center gap-0.5 px-4 py-2">
            <span className="text-[11px] font-bold tracking-wider text-brand-600 uppercase">
              Where to?
            </span>
            <input
              type="text"
              list="planner-destinations-desktop"
              value={state.where}
              onChange={(e) => set("where", e.target.value)}
              placeholder="Destination or country"
              className="w-full bg-transparent text-[15px] font-medium text-ink-900 placeholder:font-normal placeholder:text-ink-600/70 outline-none"
              autoComplete="off"
            />
            <datalist id="planner-destinations-desktop">
              <option value="Goa" />
              <option value="Dubai" />
              <option value="Bali" />
              <option value="Kashmir" />
              <option value="Maldives" />
              <option value="Kerala" />
            </datalist>
          </label>

          <span className="my-3 w-px bg-line" aria-hidden="true" />

          <label className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-4 py-2">
            <span className="text-[11px] font-bold tracking-wider text-brand-600 uppercase">
              When?
            </span>
            <input
              type="date"
              value={state.when}
              onChange={(e) => set("when", e.target.value)}
              className="w-full bg-transparent text-[15px] font-medium text-ink-900 outline-none"
            />
          </label>

          <span className="my-3 w-px bg-line" aria-hidden="true" />

          <label className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-4 py-2">
            <span className="text-[11px] font-bold tracking-wider text-brand-600 uppercase">
              Trip type
            </span>
            <select
              value={state.type}
              onChange={(e) => set("type", e.target.value)}
              className="w-full appearance-none bg-transparent text-[15px] font-medium text-ink-900 outline-none"
            >
              <option value="">Any kind of trip</option>
              {TRIP_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={go}
            className="group m-1 flex h-auto items-center gap-2 rounded-2xl bg-brand-700 px-7 text-sm font-bold text-white shadow-[0_12px_28px_-12px_rgba(18,80,196,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-600"
          >
            Find trips
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5">
              <path d="M4 10h11m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
