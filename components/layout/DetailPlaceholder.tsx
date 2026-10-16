import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";

/**
 * Placeholder detail page for /destinations/[slug], /packages/[slug],
 * /services/[slug] — resolves the record so the heading is real, and points
 * to the enquiry funnel until Phase 3 ships the full detail layouts.
 */
export default function DetailPlaceholder({
  eyebrow,
  title,
  description,
  note,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  note: string;
}) {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-xl rounded-3xl border border-line bg-surface-soft p-8 text-center">
          <Badge tone="accent">Phase 3 · Coming soon</Badge>
          <p className="mt-4 text-xl font-bold text-ink-900">
            {eyebrow} — {title}
          </p>
          {description && (
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{description}</p>
          )}
          <p className="mt-4 text-sm leading-relaxed text-ink-600">{note}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contact">Enquire now</ButtonLink>
            <ButtonLink href="/" variant="secondary">
              Back home
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
