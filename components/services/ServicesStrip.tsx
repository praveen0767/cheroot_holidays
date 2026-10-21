import Link from "next/link";
import { services } from "@/data/services";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/services/ServiceCard";

export default function ServicesStrip() {
  return (
    <section className="relative overflow-hidden bg-brand-900 py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(47,134,239,0.4),transparent_55%)]"
      />

      <Container size="wide" className="relative">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            tone="dark"
            eyebrow="Travel infrastructure"
            title="Everything a trip needs, handled"
            description="Flights, stays, visas, itineraries and support — one team, one thread."
          />
          <Link
            href="/services"
            className="group inline-flex items-center gap-1.5 pb-2 text-sm font-bold text-brand-200 transition hover:text-white"
          >
            All services
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {services.slice(0, 3).map((service, i) => (
            <Reveal key={service.slug} delay={i * 90}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
