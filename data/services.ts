export type TravelService = {
  slug: string;
  title: string;
  short: string;
  description: string;
  points: string[];
  image: string;
};

export const services: TravelService[] = [
  {
    slug: "flight-booking",
    title: "Flight Booking",
    short: "Best-fit routes and fares, without the tab-hopping.",
    description:
      "We compare routes, layovers and fare rules to find the flight that actually fits your dates and budget — then handle changes if plans shift.",
    points: ["Fare comparisons across carriers", "Seat and baggage help", "Change assistance"],
    image: "/services/flight-booking.svg",
  },
  {
    slug: "hotel-booking",
    title: "Hotel Booking",
    short: "Stays we'd book for ourselves, at rates worth having.",
    description:
      "From boutique stays to resort chains, we match hotels to the kind of trip you're taking — location, vibe and inclusions first, price second.",
    points: ["Location-first shortlists", "Verified reviews", "Upgrade requests"],
    image: "/services/hotel-booking.svg",
  },
  {
    slug: "visa-assistance",
    title: "Visa Assistance",
    short: "Paperwork handled, so you can pack instead of panic.",
    description:
      "Document checklists, application review and appointment prep for tourist and business visas — with clear timelines so nothing surprises you.",
    points: ["Document checklists", "Application review", "Status follow-ups"],
    image: "/services/visa-assistance.svg",
  },
  {
    slug: "custom-itineraries",
    title: "Custom Itineraries",
    short: "Your trip, planned around how you actually travel.",
    description:
      "Tell us the pace, the interests and the budget. We build a day-by-day plan with real timing — not a template with your name on it.",
    points: ["Day-by-day planning", "Pace that suits you", "Local experiences"],
    image: "/services/custom-itineraries.svg",
  },
  {
    slug: "travel-support",
    title: "Travel Support",
    short: "Real humans, before takeoff and while you're away.",
    description:
      "A person to call — not a ticket queue. We stay reachable through the trip for changes, delays and the unexpected bits.",
    points: ["24/7 assistance", "Flight disruption help", "On-trip rebooking"],
    image: "/services/travel-support.svg",
  },
];
