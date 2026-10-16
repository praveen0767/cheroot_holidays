/**
 * Site-wide constants.
 * NOTE: phone / email values are placeholders — replace with the real
 * Cheroot Holidays contact details before launch.
 */

export const CONTACT = {
  phone: "+91 98765 43210",
  phoneHref: "+919876543210",
  whatsapp: "https://wa.me/919876543210",
  email: "hello@cherootholidays.com",
};

export const OFFICES = [
  { city: "Chennai", region: "Tamil Nadu" },
  { city: "Coimbatore", region: "Tamil Nadu" },
  { city: "Erode", region: "Tamil Nadu" },
  { city: "Tirupur", region: "Tamil Nadu" },
] as const;

export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href?: string; children?: NavChild[] };

export const NAV: NavItem[] = [
  {
    label: "Destinations",
    href: "/destinations",
    children: [
      { label: "International", href: "/destinations?category=international" },
      { label: "Domestic", href: "/destinations?category=domestic" },
      { label: "Honeymoon", href: "/destinations?category=honeymoon" },
    ],
  },
  {
    label: "Packages",
    href: "/packages",
    children: [
      { label: "International", href: "/packages?category=international" },
      { label: "Domestic", href: "/packages?category=domestic" },
      { label: "Honeymoon", href: "/packages?category=honeymoon" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Flight Booking", href: "/services/flight-booking" },
      { label: "Hotel Booking", href: "/services/hotel-booking" },
      { label: "Visa Assistance", href: "/services/visa-assistance" },
      { label: "Custom Itineraries", href: "/services/custom-itineraries" },
    ],
  },
  { label: "About", href: "/about" },
];

export const TRIP_TYPES = [
  { value: "international", label: "International" },
  { value: "domestic", label: "Domestic" },
  { value: "honeymoon", label: "Honeymoon" },
] as const;
