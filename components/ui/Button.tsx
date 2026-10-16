import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 " +
  "hover:-translate-y-px active:translate-y-0 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-700 text-white shadow-[0_8px_24px_-8px_rgba(18,80,196,0.7)] hover:bg-brand-600 hover:shadow-[0_14px_30px_-10px_rgba(18,80,196,0.8)]",
  secondary:
    "bg-white text-brand-800 ring-1 ring-line hover:ring-brand-300 hover:text-brand-700 shadow-sm hover:shadow-md",
  outline:
    "ring-1 ring-white/50 text-white hover:bg-white/10 hover:ring-white/80",
  ghost: "text-brand-800 hover:bg-brand-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-7 text-base",
};

function Arrow() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5"
    >
      <path
        d="M4 10h11m0 0-4-4m4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function classes(variant: Variant, size: Size, className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type Shared = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: Shared & { href: string } & Omit<
    React.ComponentProps<typeof Link>,
    "href" | "children" | "className"
  >) {
  return (
    <Link href={href} className={classes(variant, size, className)} {...rest}>
      {children}
      <Arrow />
    </Link>
  );
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: Shared & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={classes(variant, size, className)} {...rest}>
      {children}
      <Arrow />
    </button>
  );
}
