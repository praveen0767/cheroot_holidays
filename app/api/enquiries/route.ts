import { NextResponse } from "next/server";
import { packages } from "@/data/packages";
import {
  getEnquiryProvider,
  generateRequestReference,
} from "@/lib/enquiry/PreviewProvider";
import type { EnquiryNotificationPayload } from "@/lib/enquiry/provider";
import { getLocalPlaceById } from "@/lib/places/search";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EnquiryPayload {
  /** Package slug — required for package-specific enquiries. Optional for custom trip. */
  slug?: string;
  /** Number of passengers (1–30) */
  passengers: number;
  /** Traveller's WhatsApp phone in E.164 format */
  phone: string;
  /** Traveller name (optional) */
  name?: string;
  /** Planned travel date (YYYY-MM-DD, optional) */
  travelDate?: string;
  /** Free-text notes (capped at 1000 chars) */
  notes?: string;
  /** Consent to be contacted */
  consent: boolean;

  // ── Location intelligence context (optional) ────────────────────────────
  /** Resolved origin place ID from LocalPlaceProvider (e.g. "in-delhi-new") */
  originPlaceId?: string;
  /** Human-readable origin name */
  originText?: string;
  /** Resolved destination place ID from LocalPlaceProvider */
  destinationPlaceId?: string;
  /** Human-readable destination name */
  destinationText?: string;
  /** Travel style / traveller persona */
  travelStyle?: string;
}

// ---------------------------------------------------------------------------
// Twilio configuration — all server-side, never exposed to the client
// ---------------------------------------------------------------------------

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID ?? "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN ?? "";
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM ?? "";
const CHEROOT_WHATSAPP_TO = process.env.CHEROOT_WHATSAPP_TO ?? "";

function isTwilioConfigured(): boolean {
  return Boolean(
    TWILIO_ACCOUNT_SID &&
      TWILIO_AUTH_TOKEN &&
      TWILIO_WHATSAPP_FROM &&
      CHEROOT_WHATSAPP_TO,
  );
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const E164_RE = /^\+?[1-9]\d{7,14}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const VALID_TRAVEL_STYLES = new Set([
  "honeymoon",
  "couple",
  "family",
  "adventure",
  "backpacker",
  "group",
  "luxury",
]);

function validatePayload(
  body: unknown,
): { ok: true; data: EnquiryPayload } | { ok: false; message: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Invalid request body." };
  }

  const b = body as Record<string, unknown>;

  // At least one of: slug (package enquiry) or destinationText (custom trip)
  const slug =
    typeof b.slug === "string" && b.slug.trim() ? b.slug.trim() : undefined;
  const destinationText =
    typeof b.destinationText === "string" && b.destinationText.trim()
      ? b.destinationText.trim()
      : undefined;
  if (!slug && !destinationText) {
    return {
      ok: false,
      message: "Please specify a package or a destination for your trip.",
    };
  }

  // Required: passengers (1–30)
  const passengers = Number(b.passengers);
  if (!Number.isInteger(passengers) || passengers < 1 || passengers > 30) {
    return { ok: false, message: "Passenger count must be between 1 and 30." };
  }

  // Required: phone (E.164)
  if (typeof b.phone !== "string" || !E164_RE.test(b.phone.trim())) {
    return {
      ok: false,
      message: "Please provide a valid phone number in E.164 format.",
    };
  }

  // Required: consent
  if (b.consent !== true) {
    return { ok: false, message: "Contact consent is required." };
  }

  // Optional: name
  const name =
    typeof b.name === "string" && b.name.trim() ? b.name.trim() : undefined;

  // Optional: travelDate
  let travelDate: string | undefined;
  if (typeof b.travelDate === "string" && b.travelDate.trim()) {
    if (!DATE_RE.test(b.travelDate.trim())) {
      return { ok: false, message: "Travel date must be in YYYY-MM-DD format." };
    }
    travelDate = b.travelDate.trim();
  }

  // Optional: notes (cap at 1000 chars)
  const notes =
    typeof b.notes === "string" && b.notes.trim()
      ? b.notes.trim().slice(0, 1000)
      : undefined;

  // Optional: origin
  const originPlaceId =
    typeof b.originPlaceId === "string" && b.originPlaceId.trim()
      ? b.originPlaceId.trim()
      : undefined;
  const originText =
    typeof b.originText === "string" && b.originText.trim()
      ? b.originText.trim()
      : undefined;

  // Optional: destinationPlaceId
  const destinationPlaceId =
    typeof b.destinationPlaceId === "string" && b.destinationPlaceId.trim()
      ? b.destinationPlaceId.trim()
      : undefined;

  // Optional: travelStyle (allow-list validated)
  let travelStyle: string | undefined;
  if (typeof b.travelStyle === "string" && b.travelStyle.trim()) {
    const ts = b.travelStyle.trim().toLowerCase();
    if (!VALID_TRAVEL_STYLES.has(ts)) {
      return { ok: false, message: `Unknown travel style: ${ts}.` };
    }
    travelStyle = ts;
  }

  return {
    ok: true,
    data: {
      slug,
      passengers,
      phone: (b.phone as string).trim(),
      name,
      travelDate,
      notes,
      consent: true,
      originPlaceId,
      originText,
      destinationPlaceId,
      destinationText,
      travelStyle,
    },
  };
}

// ---------------------------------------------------------------------------
// Twilio WhatsApp sender
// ---------------------------------------------------------------------------

async function sendWhatsAppNotification(message: string): Promise<void> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

  const body = new URLSearchParams({
    From: TWILIO_WHATSAPP_FROM,
    To: CHEROOT_WHATSAPP_TO,
    Body: message,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString(
          "base64",
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    console.error("[enquiries] Twilio error:", res.status, errBody);
    throw new Error("Failed to send WhatsApp notification.");
  }
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  // Parse JSON body safely
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body." },
      { status: 400 },
    );
  }

  // Validate
  const validation = validatePayload(body);
  if (!validation.ok) {
    return NextResponse.json(
      { message: validation.message },
      { status: 400 },
    );
  }

  const data = validation.data;

  // Resolve package from canonical dataset — never trust client-supplied title
  const pkg = data.slug ? packages.find((p) => p.slug === data.slug) : null;
  if (data.slug && !pkg) {
    return NextResponse.json(
      { message: "Package not found." },
      { status: 404 },
    );
  }

  // Resolve destination details
  const resolvedDestPlace = data.destinationPlaceId
    ? getLocalPlaceById(data.destinationPlaceId)
    : null;
  const destinationLabel =
    resolvedDestPlace?.displayName ??
    data.destinationText ??
    pkg?.destination ??
    "Unspecified destination";
  const destinationResolved = Boolean(resolvedDestPlace || pkg);

  // Resolve origin details
  const resolvedOriginPlace = data.originPlaceId
    ? getLocalPlaceById(data.originPlaceId)
    : null;
  const originLabel =
    resolvedOriginPlace?.displayName ?? data.originText ?? null;

  // Build canonical EnquiryNotificationPayload
  const requestReference = generateRequestReference();
  const notificationPayload: EnquiryNotificationPayload = {
    requestReference,
    createdAt: new Date().toISOString(),
    packageTitle: pkg ? pkg.title : null,
    packageSlug: pkg ? pkg.slug : null,
    originLabel,
    destinationLabel,
    destinationResolved,
    travelStyle: data.travelStyle ?? null,
    passengers: data.passengers,
    travelDate: data.travelDate ?? null,
    callbackPhone: data.phone,
    travelerName: data.name ?? null,
    notes: data.notes ?? null,
  };

  const deliveryProviderSetting = (
    process.env.ENQUIRY_DELIVERY_PROVIDER || "preview"
  ).toLowerCase();

  // Fail closed in production if external provider is explicitly configured but not set up
  if (
    process.env.NODE_ENV === "production" &&
    deliveryProviderSetting !== "preview" &&
    !isTwilioConfigured()
  ) {
    console.error(
      "[enquiries] Production error: Delivery provider configured as non-preview but credentials unavailable.",
    );
    return NextResponse.json(
      {
        ok: false,
        message:
          "Enquiry delivery service is currently unavailable. Please contact Cheroot Holidays directly.",
      },
      { status: 503 },
    );
  }

  // Preview mode (Twilio not configured or provider set to preview)
  if (deliveryProviderSetting === "preview" || !isTwilioConfigured()) {
    const provider = getEnquiryProvider();
    const sendResult = await provider.send(notificationPayload);

    return NextResponse.json(
      {
        ok: true,
        preview: true,
        reference: requestReference,
        message:
          "Your enquiry has been received in preview mode! Our team will review it and contact you shortly.",
        details: sendResult.status === "preview" ? sendResult.message : undefined,
        context: {
          ...(data.slug && { package: data.slug }),
          packageTitle: pkg?.title ?? null,
          origin: originLabel,
          destination: destinationLabel,
          destinationResolved,
          travelStyle: data.travelStyle ?? null,
          passengers: data.passengers,
        },
      },
      { status: 200 },
    );
  }

  // Production live send via Twilio
  const lines = [
    `🏖️ *New Trip Enquiry — Cheroot Holidays*`,
    ``,
    `📌 *Ref:* ${requestReference}`,
  ];

  if (pkg) {
    lines.push(`📦 *Package:* ${pkg.title}`);
    lines.push(`📍 *Destination:* ${pkg.destination}`);
  } else {
    lines.push(`📍 *Destination:* ${destinationLabel}`);
  }

  if (originLabel) lines.push(`🛫 *Travelling from:* ${originLabel}`);

  if (data.travelStyle) {
    lines.push(`🎭 *Travel style:* ${data.travelStyle}`);
  }

  lines.push(`👥 *Passengers:* ${data.passengers}`);
  lines.push(`📞 *Callback:* ${data.phone}`);
  if (data.name) lines.push(`👤 *Name:* ${data.name}`);
  if (data.travelDate) lines.push(`📅 *Travel date:* ${data.travelDate}`);
  if (data.notes) lines.push(`📝 *Notes:* ${data.notes}`);
  lines.push(``, `_Sent from cherootholidays.com_`);
  const message = lines.join("\n");

  try {
    await sendWhatsAppNotification(message);
  } catch (err) {
    console.error("[enquiries] WhatsApp send failed:", err);
    return NextResponse.json(
      {
        message:
          "Failed to send your enquiry. Please try again or contact us directly.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    reference: requestReference,
    message:
      "Enquiry sent successfully. We will contact you shortly via WhatsApp.",
  });
}
