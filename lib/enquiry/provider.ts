/**
 * Enquiry Delivery Provider Interface
 *
 * Defines the contract for sending trip enquiry notifications.
 * Current implementation: Preview (local only, no external calls).
 * Future: Plug in Twilio, Email, or any provider without changing the UI.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type EnquiryNotificationPayload = {
  /** Unique reference for this enquiry (e.g. "CHR-20261021-A3F9") */
  requestReference: string;
  /** ISO timestamp of enquiry creation */
  createdAt: string;
  /** Resolved package title if a slug was matched, else null */
  packageTitle: string | null;
  /** Package slug if matched */
  packageSlug: string | null;
  /** Origin place (display text) */
  originLabel: string | null;
  /** Destination label (display text) */
  destinationLabel: string;
  /** Whether the destination was resolved from the local registry */
  destinationResolved: boolean;
  /** Travel style / persona */
  travelStyle: string | null;
  /** Number of travellers */
  passengers: number;
  /** Travel date (YYYY-MM-DD) or null */
  travelDate: string | null;
  /** Normalized callback number (E.164) — never log fully */
  callbackPhone: string;
  /** Traveller name */
  travelerName: string | null;
  /** Additional notes */
  notes: string | null;
};

export type ProviderSendResult =
  | { status: "sent"; messageId: string }
  | { status: "preview"; message: string }
  | { status: "failed"; reason: string; retryable: boolean }
  | { status: "unavailable"; reason: string };

/**
 * EnquiryDeliveryProvider
 *
 * Implement this interface to plug in a notification provider.
 * The UI and enquiry route depend only on this interface.
 */
export interface EnquiryDeliveryProvider {
  readonly id: string;
  readonly name: string;
  isAvailable(): boolean;
  send(payload: EnquiryNotificationPayload): Promise<ProviderSendResult>;
}

// ─── Request reference generator ─────────────────────────────────────────────

/**
 * Generates a short deterministic-ish reference for an enquiry.
 * Not cryptographically random — used for internal tracking only.
 */
export function generateRequestReference(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CHR-${datePart}-${randPart}`;
}

// ─── Message formatter ────────────────────────────────────────────────────────

const STYLE_EMOJI: Record<string, string> = {
  honeymoon: "💑", family: "👨‍👩‍👧", adventure: "🧗",
  backpacker: "🎒", group: "👥", luxury: "✨",
};

/**
 * Builds a human-readable WhatsApp-style notification message
 * from a validated, server-resolved enquiry payload.
 *
 * This function is pure (no side effects) and fully unit-testable.
 */
export function formatEnquiryMessage(payload: EnquiryNotificationPayload): string {
  const lines: string[] = [
    `🏖️ *CHEROOT HOLIDAYS — NEW TRIP ENQUIRY*`,
    ``,
    `📌 *Ref:* ${payload.requestReference}`,
    `🕐 *Received:* ${new Date(payload.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
    ``,
  ];

  if (payload.packageTitle) {
    lines.push(`📦 *Package:* ${payload.packageTitle}`);
  } else {
    lines.push(`📦 *Package:* Custom itinerary requested`);
  }

  lines.push(`📍 *Destination:* ${payload.destinationLabel}${!payload.destinationResolved ? " _(custom, unverified)_" : ""}`);

  if (payload.originLabel) {
    lines.push(`🛫 *Starting from:* ${payload.originLabel}`);
  }

  if (payload.travelStyle) {
    const emoji = STYLE_EMOJI[payload.travelStyle] ?? "";
    lines.push(`🎭 *Travel style:* ${emoji} ${payload.travelStyle}`);
  }

  lines.push(`👥 *Travellers:* ${payload.passengers}`);
  lines.push(`📞 *Callback:* ${payload.callbackPhone}`);

  if (payload.travelerName) lines.push(`👤 *Name:* ${payload.travelerName}`);
  if (payload.travelDate) lines.push(`📅 *Travel date:* ${payload.travelDate}`);
  if (payload.notes) lines.push(`📝 *Notes:* ${payload.notes}`);

  lines.push(``, `_Sent from cherootholidays.com_`);
  return lines.join("\n");
}
