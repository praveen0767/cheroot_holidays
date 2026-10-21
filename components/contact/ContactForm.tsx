"use client";

import { useState, useId } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/ui/Container";
import { CONTACT, OFFICES } from "@/lib/constants";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");
  const interestParam = searchParams.get("interest");
  // travelStyle from TravelRhythm strip or TripPlanner (?travelStyle=family etc.)
  const travelStyleParam = searchParams.get("travelStyle");

  const getInitialDestination = () =>
    searchParams.get("destination") ??
    searchParams.get("package") ??
    (serviceParam
      ? `Service: ${serviceParam.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`
      : "");

  const getInitialTripType = () => {
    // travelStyle param (from TravelRhythm strip) takes precedence
    if (travelStyleParam === "honeymoon") return "honeymoon";
    if (travelStyleParam === "family") return "domestic";
    if (travelStyleParam === "adventure") return "domestic";
    if (travelStyleParam === "backpacker") return "domestic";
    if (travelStyleParam === "luxury") return "international";
    if (travelStyleParam === "group") return "international";
    // Fall back to legacy interestParam
    if (interestParam === "honeymoon") return "honeymoon";
    if (interestParam === "domestic") return "domestic";
    if (interestParam === "international") return "international";
    return "custom";
  };

  const [destination, setDestination] = useState(getInitialDestination);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travellers, setTravellers] = useState("2 travellers");
  const [tripType, setTripType] = useState<string>(getInitialTripType);
  const [travelStyle] = useState<string>(travelStyleParam ?? "");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Sync when query parameters change (adjusting state during render)
  const paramsKey = searchParams.toString();
  const [prevParamsKey, setPrevParamsKey] = useState(paramsKey);
  if (prevParamsKey !== paramsKey) {
    setPrevParamsKey(paramsKey);
    const nextDest = getInitialDestination();
    const nextType = getInitialTripType();
    if (nextDest) setDestination(nextDest);
    if (nextType !== "custom" || interestParam) setTripType(nextType);
  }

  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const destId = useId();
  const dateId = useId();
  const travellersId = useId();
  const tripTypeId = useId();
  const notesId = useId();

  const styleLabel = travelStyle
    ? travelStyle.charAt(0).toUpperCase() + travelStyle.slice(1)
    : "";

  const waMessage = encodeURIComponent(
    `Hello Cheroot Holidays!\n` +
      `I would like to request a quotation for: ${destination || "a holiday journey"}.\n` +
      (styleLabel ? `Travel style: ${styleLabel}\n` : "") +
      (name ? `Name: ${name}\n` : "") +
      (phone ? `Phone: ${phone}\n` : "") +
      (travelDate ? `Approx. Travel Date: ${travelDate}\n` : "") +
      `Travellers: ${travellers}\n` +
      (notes ? `Notes: ${notes}\n` : "") +
      `Please share the latest options and itinerary. Thank you!`,
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <Container className="py-10 sm:py-16">
      <div className="grid gap-8 lg:gap-12 lg:grid-cols-12">
        {/* Left column: Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-line bg-white p-4 sm:p-8 lg:p-10 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-ink-900">
              Request a Personalised Itinerary & Quote
            </h2>
            <p className="mt-2 text-sm text-ink-600">
              Tell us where you want to travel, your preferred dates, and group preferences.
              Our destination specialists will craft a bespoke proposal.
            </p>

            {submitted ? (
              <div
                className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 text-center"
                role="status"
              >
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="size-6" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink-900">
                  Enquiry Received!
                </h3>
                <p className="mt-2 text-sm text-ink-600">
                  Thank you, <strong className="text-ink-900">{name || "Traveller"}</strong>.
                  Your request for{" "}
                  <strong className="text-ink-900">{destination || "your chosen destination"}</strong>{" "}
                  has been sent to our planning desk.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a
                    href={`${CONTACT.whatsapp}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1ebe5d]"
                  >
                    Send to WhatsApp now
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-surface-soft cursor-pointer"
                  >
                    Edit details
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {/* Destination */}
                <div>
                  <label htmlFor={destId} className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                    Destination of Interest *
                  </label>
                  <input
                    id={destId}
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Dubai, Munnar, Bali, Kyoto, Thailand…"
                    className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-soft px-4 text-sm text-ink-900 placeholder:text-ink-600/50 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
                  />
                </div>

                {/* Name & Phone */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor={nameId} className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                      Your Name *
                    </label>
                    <input
                      id={nameId}
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-soft px-4 text-sm text-ink-900 placeholder:text-ink-600/50 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
                    />
                  </div>

                  <div>
                    <label htmlFor={phoneId} className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      id={phoneId}
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-soft px-4 text-sm text-ink-900 placeholder:text-ink-600/50 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
                    />
                  </div>
                </div>

                {/* Email & Date */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor={emailId} className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                      Email Address
                    </label>
                    <input
                      id={emailId}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-soft px-4 text-sm text-ink-900 placeholder:text-ink-600/50 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
                    />
                  </div>

                  <div>
                    <label htmlFor={dateId} className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                      Approx. Travel Date / Month
                    </label>
                    <input
                      id={dateId}
                      type="text"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      placeholder="e.g. November 2026 or Diwali"
                      className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-soft px-4 text-sm text-ink-900 placeholder:text-ink-600/50 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
                    />
                  </div>
                </div>

                {/* Travellers & Trip Type */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor={travellersId} className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                      Travellers Count
                    </label>
                    <select
                      id={travellersId}
                      value={travellers}
                      onChange={(e) => setTravellers(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-soft px-3 text-sm text-ink-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200 cursor-pointer"
                    >
                      <option value="1 traveller (Solo)">1 traveller (Solo)</option>
                      <option value="2 travellers (Couple)">2 travellers (Couple)</option>
                      <option value="3-5 travellers (Family/Friends)">3-5 travellers (Family/Friends)</option>
                      <option value="6+ travellers (Group)">6+ travellers (Group)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor={tripTypeId} className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                      Journey Style
                    </label>
                    <select
                      id={tripTypeId}
                      value={tripType}
                      onChange={(e) => setTripType(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-soft px-3 text-sm text-ink-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200 cursor-pointer"
                    >
                      <option value="custom">Custom Itinerary (Flexible)</option>
                      <option value="international">International Holiday</option>
                      <option value="domestic">Domestic Explorer</option>
                      <option value="honeymoon">Honeymoon Special</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor={notesId} className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                    Preferences & Special Requests
                  </label>
                  <textarea
                    id={notesId}
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Preferred hotel star rating, dietary requests, sightseeing preferences…"
                    className="mt-1.5 w-full rounded-xl border border-line bg-surface-soft p-4 text-sm text-ink-900 placeholder:text-ink-600/50 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
                  />
                </div>

                {/* Submit button & WhatsApp quick option */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-700 px-4 py-3 sm:px-6 sm:py-3.5 text-sm font-bold text-white transition hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-brand-500 cursor-pointer"
                  >
                    Submit Trip Request
                  </button>

                  <a
                    href={`${CONTACT.whatsapp}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 sm:px-6 sm:py-3.5 text-sm font-bold text-white transition hover:bg-[#1ebe5d]"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4.5" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347Z" />
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.86.506 3.601 1.385 5.098L2 22l5.047-1.373A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Zm0 18a7.963 7.963 0 0 1-4.274-1.239l-.307-.183-3 .817.832-2.942-.2-.318A7.966 7.966 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8Z" />
                    </svg>
                    Send on WhatsApp
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right column: Quick contacts & Regional offices */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick contact card */}
          <div className="rounded-3xl border border-brand-100 bg-brand-50/70 p-4 sm:p-6 lg:p-8">
            <h3 className="text-lg font-bold text-ink-900">Direct Travel Support</h3>
            <p className="mt-1 text-sm text-ink-600">
              Need immediate assistance or bespoke booking help? Connect directly with our team.
            </p>

            <div className="mt-6 space-y-3">
              <a
                href={`tel:${CONTACT.phoneHref}`}
                className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3.5 text-sm font-semibold text-ink-800 transition hover:border-brand-300"
              >
                <div className="grid size-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <svg viewBox="0 0 20 20" fill="none" className="size-4.5" aria-hidden="true">
                    <path
                      d="M3.5 4.5A1.5 1.5 0 0 1 5 3h1.8a1.5 1.5 0 0 1 1.45 1.12l.6 2.4a1.5 1.5 0 0 1-.42 1.48L7.2 9.2a11.5 11.5 0 0 0 3.6 3.6l1.2-1.23a1.5 1.5 0 0 1 1.48-.42l2.4.6A1.5 1.5 0 0 1 17 13.2V15a1.5 1.5 0 0 1-1.5 1.5c-7.46 0-13.5-6.04-13.5-13.5V4.5Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-ink-600 font-normal">Phone support</p>
                  <p>{CONTACT.phone}</p>
                </div>
              </a>

              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3.5 text-sm font-semibold text-ink-800 transition hover:border-brand-300"
              >
                <div className="grid size-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <svg viewBox="0 0 20 20" fill="none" className="size-4.5" aria-hidden="true">
                    <rect x="2.5" y="4" width="15" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
                    <path d="m3 5.5 7 5.5 7-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-ink-600 font-normal">Email enquiries</p>
                  <p>{CONTACT.email}</p>
                </div>
              </a>
            </div>

            <p className="mt-4 text-[11px] text-ink-600">
              ⚠️ Contact details shown are placeholders pending client confirmation — see{" "}
              <code>lib/constants.ts</code>.
            </p>
          </div>

          {/* Regional Offices */}
          <div className="rounded-3xl border border-line bg-white p-4 sm:p-6 lg:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-ink-900">Branch Locations</h3>
            <p className="mt-1 text-sm text-ink-600">
              In-person consultation available across Tamil Nadu offices:
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OFFICES.map((office) => (
                <div
                  key={office.city}
                  className="rounded-2xl border border-line bg-surface-soft p-3.5"
                >
                  <p className="font-bold text-ink-900 text-sm">{office.city}</p>
                  <p className="text-xs text-ink-600">{office.region}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
