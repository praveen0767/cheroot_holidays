import { cn } from "@/lib/utils";

type Tone = "brand" | "accent" | "success" | "glass";

const tones: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700 ring-brand-100",
  accent: "bg-accent/15 text-accent ring-accent/30",
  success: "bg-success/10 text-success ring-success/25",
  glass: "bg-white/15 text-white ring-white/30 backdrop-blur-sm",
};

export default function Badge({
  tone = "brand",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
