import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";

/**
 * Placeholder body for routes scheduled for Phase 3 (core pages).
 * Keeps navigation functional and the enquiry funnel intact meanwhile.
 */
export default function PlaceholderPage({ note }: { note: string }) {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-xl rounded-3xl border border-line bg-surface-soft p-8 text-center">
          <Badge tone="accent">Phase 3 · Coming soon</Badge>
          <p className="mt-4 text-base leading-relaxed text-ink-600">{note}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contact">Plan a trip in the meantime</ButtonLink>
            <ButtonLink href="/" variant="secondary">
              Back home
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
