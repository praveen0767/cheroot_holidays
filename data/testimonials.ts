export type Testimonial = {
  name: string;
  location: string;
  trip: string;
  rating: number;
  quote: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Ananya & Rohan",
    location: "Chennai",
    trip: "Bali Honeymoon · 6N / 7D",
    rating: 5,
    quote:
      "Every day felt considered — the pacing, the stays, even a small surprise dinner. We just showed up and enjoyed it.",
  },
  {
    name: "Karthik Subramanian",
    location: "Coimbatore",
    trip: "Dubai Family Trip · 5N / 6D",
    rating: 5,
    quote:
      "Transparent pricing and zero last-minute surprises. When our flight was delayed, someone was on it before we even landed.",
  },
  {
    name: "Meera Krishnan",
    location: "Erode",
    trip: "Kashmir Snowline Journey · 5N / 6D",
    rating: 5,
    quote:
      "They planned around how we like to travel — slow mornings, no rushed checklists. It felt like a trip a friend organised.",
  },
  {
    name: "Daniel & Priya",
    location: "Tirupur",
    trip: "Maldives Overwater Retreat · 4N / 5D",
    rating: 4,
    quote:
      "Clear inclusions from day one, and genuinely human support throughout. The villa upgrade they arranged was the cherry on top.",
  },
];
