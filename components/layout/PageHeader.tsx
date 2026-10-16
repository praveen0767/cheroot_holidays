import Container from "@/components/ui/Container";

/**
 * Dark hero band for interior pages — also guarantees the transparent
 * top-of-page header state always sits over a dark surface.
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-900 pt-32 pb-14 sm:pt-40 sm:pb-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(47,134,239,0.5),transparent_55%),linear-gradient(160deg,#07235a_0%,#0b3487_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-20 -right-16 size-72 rounded-full border border-white/10"
      />
      <Container className="relative">
        <p className="text-xs font-bold tracking-[0.2em] text-brand-200 uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base text-brand-100/85 sm:text-lg">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
