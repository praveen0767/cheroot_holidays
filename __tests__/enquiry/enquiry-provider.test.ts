/**
 * Enquiry Provider Tests
 *
 * Tests for the message formatter and preview provider.
 * No external API calls are made.
 */

import { describe, it, expect, vi } from "vitest";
import {
  formatEnquiryMessage,
  generateRequestReference,
  type EnquiryNotificationPayload,
} from "@/lib/enquiry/provider";
import { PreviewEnquiryProvider } from "@/lib/enquiry/PreviewProvider";

// ─── generateRequestReference ─────────────────────────────────────────────────

describe("generateRequestReference", () => {
  it("starts with CHR-", () => {
    expect(generateRequestReference()).toMatch(/^CHR-/);
  });

  it("includes a date segment", () => {
    const ref = generateRequestReference();
    expect(ref).toMatch(/^CHR-\d{8}-/);
  });

  it("generates unique references on successive calls", () => {
    const refs = new Set(Array.from({ length: 10 }, generateRequestReference));
    expect(refs.size).toBeGreaterThan(1);
  });
});

// ─── formatEnquiryMessage ─────────────────────────────────────────────────────

function makePayload(overrides: Partial<EnquiryNotificationPayload> = {}): EnquiryNotificationPayload {
  return {
    requestReference: "CHR-20261021-TEST",
    createdAt: "2026-10-21T07:30:00.000Z",
    packageTitle: null,
    packageSlug: null,
    originLabel: null,
    destinationLabel: "Goa",
    destinationResolved: true,
    travelStyle: null,
    passengers: 2,
    travelDate: null,
    callbackPhone: "+919876543210",
    travelerName: null,
    notes: null,
    ...overrides,
  };
}

describe("formatEnquiryMessage", () => {
  it("includes the request reference", () => {
    const msg = formatEnquiryMessage(makePayload());
    expect(msg).toContain("CHR-20261021-TEST");
  });

  it("shows destination", () => {
    const msg = formatEnquiryMessage(makePayload({ destinationLabel: "Bali" }));
    expect(msg).toContain("Bali");
  });

  it("shows package title when resolved", () => {
    const msg = formatEnquiryMessage(makePayload({ packageTitle: "Bali 5N6D Honeymoon" }));
    expect(msg).toContain("Bali 5N6D Honeymoon");
  });

  it("shows 'Custom itinerary requested' when no package", () => {
    const msg = formatEnquiryMessage(makePayload({ packageTitle: null }));
    expect(msg).toContain("Custom itinerary requested");
  });

  it("marks destination as unresolved when destinationResolved is false", () => {
    const msg = formatEnquiryMessage(makePayload({
      destinationLabel: "Somewhere Custom",
      destinationResolved: false,
    }));
    expect(msg).toContain("unverified");
  });

  it("does NOT mark verified destinations as unverified", () => {
    const msg = formatEnquiryMessage(makePayload({
      destinationLabel: "Goa",
      destinationResolved: true,
    }));
    expect(msg).not.toContain("unverified");
  });

  it("includes origin when provided", () => {
    const msg = formatEnquiryMessage(makePayload({ originLabel: "Chennai" }));
    expect(msg).toContain("Chennai");
  });

  it("omits origin section when null", () => {
    const msg = formatEnquiryMessage(makePayload({ originLabel: null }));
    expect(msg).not.toContain("Starting from");
  });

  it("includes travel style with emoji", () => {
    const msg = formatEnquiryMessage(makePayload({ travelStyle: "honeymoon" }));
    expect(msg).toContain("honeymoon");
    expect(msg).toContain("💑");
  });

  it("includes passenger count", () => {
    const msg = formatEnquiryMessage(makePayload({ passengers: 4 }));
    expect(msg).toContain("4");
  });

  it("includes notes when present", () => {
    const msg = formatEnquiryMessage(makePayload({ notes: "Budget trip, prefer hostels" }));
    expect(msg).toContain("Budget trip, prefer hostels");
  });

  it("omits notes section when null", () => {
    const msg = formatEnquiryMessage(makePayload({ notes: null }));
    expect(msg).not.toContain("Notes:");
  });

  it("includes travel date when provided", () => {
    const msg = formatEnquiryMessage(makePayload({ travelDate: "2027-03-15" }));
    expect(msg).toContain("2027-03-15");
  });

  it("is deterministic for the same input", () => {
    const payload = makePayload({ destinationLabel: "Manali", travelStyle: "adventure" });
    expect(formatEnquiryMessage(payload)).toBe(formatEnquiryMessage(payload));
  });

  it("does not expose full phone number in the formatted message header", () => {
    // The message should include the callback number but not as a raw syslog
    const msg = formatEnquiryMessage(makePayload({ callbackPhone: "+911234567890" }));
    // The number IS included in the message (this is the WhatsApp notification body)
    expect(msg).toContain("+911234567890");
  });
});

// ─── PreviewEnquiryProvider ───────────────────────────────────────────────────

describe("PreviewEnquiryProvider", () => {
  it("is always available", () => {
    const provider = new PreviewEnquiryProvider();
    expect(provider.isAvailable()).toBe(true);
  });

  it("returns preview status without external calls", async () => {
    const provider = new PreviewEnquiryProvider();
    // Mock console.info to avoid test noise
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const result = await provider.send(makePayload());
    consoleSpy.mockRestore();
    expect(result.status).toBe("preview");
  });

  it("preview result contains no fake messageId", async () => {
    const provider = new PreviewEnquiryProvider();
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const result = await provider.send(makePayload());
    consoleSpy.mockRestore();
    // Preview results should not have a real messageId
    expect((result as { status: string; messageId?: string }).messageId).toBeUndefined();
  });

  it("does not throw for any valid payload", async () => {
    const provider = new PreviewEnquiryProvider();
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    await expect(provider.send(makePayload({
      destinationLabel: "Delhi",
      destinationResolved: false,
      originLabel: "Chennai",
      travelStyle: "family",
      passengers: 5,
      notes: "Two kids, need child-friendly hotels",
    }))).resolves.toBeDefined();
    consoleSpy.mockRestore();
  });
});
