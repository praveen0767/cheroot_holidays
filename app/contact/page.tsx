import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/layout/PageHeader";
import ContactForm from "@/components/contact/ContactForm";
import Container from "@/components/ui/Container";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact & Trip Quote Request",
  description:
    "Plan your holiday with Cheroot Holidays. Request a personalised itinerary, quote, or speak to our travel specialists.",
  alternates: {
    canonical: absoluteUrl("/contact"),
  },
  openGraph: {
    title: "Contact & Trip Quote Request | Cheroot Holidays",
    description:
      "Request a personalised holiday itinerary and quote from our travel specialists. Cheroot Holidays — Explore · Experience · Enjoy.",
    url: absoluteUrl("/contact"),
    images: [
      {
        url: "/brand/cheroot-logo.png",
        alt: "Cheroot Holidays — Contact Us",
      },
    ],
  },
};

function ContactFallback() {
  return (
    <Container className="py-20 text-center">
      <div
        className="inline-block size-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600"
        aria-label="Loading contact form"
        role="status"
      />
    </Container>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Plan Your Journey"
        title="Where will you go next?"
        description="Share your destination, preferred dates, and group size. We'll craft a bespoke itinerary tailored to your dream trip."
      />
      <Suspense fallback={<ContactFallback />}>
        <ContactForm />
      </Suspense>
    </>
  );
}
