import Container from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export default function FinalCTA() {
  return (
    <section className="bg-surface py-16 sm:py-20 lg:py-24">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-brand-900 px-6 py-14 text-center sm:px-12 lg:py-20">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(90,164,245,0.5),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(18,80,196,0.7),transparent_60%)]"
            />
            <div
              aria-hidden="true"
              className="absolute -top-16 -left-16 size-56 rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="absolute -right-10 -bottom-20 size-72 rounded-full border border-white/10"
            />

            <div className="relative mx-auto max-w-2xl">
              <p className="text-xs font-bold tracking-[0.2em] text-brand-200 uppercase">
                Ready to travel?
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                Let&apos;s plan your next story.
              </h2>
              <p className="mt-4 text-base text-brand-100/85 sm:text-lg">
                Tell us where you&apos;re headed — we&apos;ll come back with a
                thoughtfully built itinerary and honest pricing.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/contact" size="lg" variant="secondary">
                  Plan My Trip
                </ButtonLink>
                <ButtonLink href="/packages" size="lg" variant="outline">
                  Browse packages
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
