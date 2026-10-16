import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Cropped compass/pin mark from the supplied logo (the full badge includes the
 * wordmark, which would be illegible at header size).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block size-10 shrink-0 rounded-xl bg-surface-soft shadow-sm ring-1 ring-black/5",
        className,
      )}
      style={{
        backgroundImage: "url(/brand/cheroot-logo.png)",
        backgroundSize: "170%",
        backgroundPosition: "center 21%",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-base font-extrabold tracking-tight whitespace-nowrap sm:text-lg",
        className,
      )}
    >
      Cheroot <span className="font-semibold">Holidays</span>
    </span>
  );
}

export default function Logo({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <Link
      href="/"
      aria-label="Cheroot Holidays — home"
      className={cn("flex items-center gap-2.5", className)}
    >
      <LogoMark />
      <Wordmark
        className={tone === "dark" ? "text-ink-900" : "text-white drop-shadow-sm"}
      />
    </Link>
  );
}
