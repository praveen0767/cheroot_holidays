import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

const PROPOSITIONS = [
  {
    title: "Curated journeys",
    body: "Trips designed around actual travel intent — pace, interests and budget — not templates.",
    icon: (
      <path
        d="M12 3.5 14.6 9l5.9.7-4.4 4 1.2 5.8L12 16.7 6.7 19.5l1.2-5.8-4.4-4L9.4 9 12 3.5Z"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Transparent planning",
    body: "Clear inclusions, clear pricing, no surprise line items. You always know what you're paying for.",
    icon: (
      <>
        <path d="M4 6.5h16M4 12h10M4 17.5h13" strokeLinecap="round" />
        <circle cx="18.5" cy="12" r="2.5" />
      </>
    ),
  },
  {
    title: "Human assistance",
    body: "Real support before and during travel — a person to call, not a ticket queue.",
    icon: (
      <>
        <path d="M5 18.5a7 7 0 0 1 14 0" strokeLinecap="round" />
        <circle cx="12" cy="8.5" r="3.5" />
      </>
    ),
  },
  {
    title: "Flexible experiences",
    body: "Custom itineraries instead of rigid packages — change the plan when your trip changes.",
    icon: (
      <>
        <path d="M7 7h10v10" strokeLinecap="round" />
        <path d="M17 7 7 17" strokeLinecap="round" />
        <circle cx="12" cy="12" r="9" />
      </>
    ),
  },
];

export default function TrustGrid() {
  return (
    <section id="why-cheroot" className="relative overflow-hidden bg-surface-soft py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="absolute -top-32 -left-32 size-96 rounded-full bg-brand-100/70 blur-3xl"
      />
      <Container className="relative">
        <SectionHeading
          eyebrow="Why Cheroot"
          title="A travel product, not a paperwork machine"
          description="Four commitments that shape every trip we plan."
          align="center"
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {PROPOSITIONS.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <div className="group h-full rounded-3xl border border-line/80 bg-white p-6 shadow-[0_16px_40px_-32px_rgba(11,27,51,0.6)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_24px_50px_-30px_rgba(18,80,196,0.45)]">
                <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-700 group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="1.6"
                    stroke="currentColor"
                    className="size-6"
                    aria-hidden="true"
                  >
                    {p.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-ink-900">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
