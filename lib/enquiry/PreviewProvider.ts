/**
 * PreviewEnquiryProvider
 *
 * Development/demo-mode provider that logs the notification payload
 * to the server console and returns a preview status.
 *
 * No external API calls are made. Use this until a real delivery
 * provider is configured via ENQUIRY_DELIVERY_PROVIDER.
 */

import type {
  EnquiryDeliveryProvider,
  EnquiryNotificationPayload,
  ProviderSendResult,
} from "./provider";
import { formatEnquiryMessage, generateRequestReference } from "./provider";

export class PreviewEnquiryProvider implements EnquiryDeliveryProvider {
  readonly id = "preview";
  readonly name = "Preview (Development Only — No External Calls)";

  isAvailable(): boolean {
    return true; // Preview is always available as fallback
  }

  async send(payload: EnquiryNotificationPayload): Promise<ProviderSendResult> {
    const message = formatEnquiryMessage(payload);

    // Log to server console only — never send to any external service
    console.info(
      `\n[ENQUIRY PREVIEW] ════════════════════════════════════════════\n` +
      `Ref: ${payload.requestReference}\n` +
      `Destination: ${payload.destinationLabel}\n` +
      `Origin: ${payload.originLabel ?? "Not specified"}\n` +
      `Style: ${payload.travelStyle ?? "Any"}\n` +
      `Passengers: ${payload.passengers}\n` +
      `Phone (partial): +...${payload.callbackPhone.slice(-4)}\n` +
      `[No external message was sent — PREVIEW mode]\n` +
      `════════════════════════════════════════════════════════════\n`,
    );

    return {
      status: "preview",
      message: `PREVIEW — No external message sent.\n\n${message}`,
    };
  }
}

/**
 * Factory: returns the configured delivery provider.
 *
 * When ENQUIRY_DELIVERY_PROVIDER=preview (or not set), returns the preview provider.
 * When ENQUIRY_DELIVERY_PROVIDER=twilio (future), a TwilioEnquiryProvider will be loaded.
 *
 * The factory lives server-side only. Never call it from client components.
 */
export function getEnquiryProvider(): EnquiryDeliveryProvider {
  const configured = process.env.ENQUIRY_DELIVERY_PROVIDER ?? "preview";

  if (configured === "preview" || !configured) {
    return new PreviewEnquiryProvider();
  }

  // Future: dynamically load the configured provider
  // e.g. if (configured === "twilio") return new TwilioEnquiryProvider();
  console.warn(`[enquiry] Unknown provider "${configured}" — falling back to preview.`);
  return new PreviewEnquiryProvider();
}

export { generateRequestReference };
