import { cn } from "@/lib/utils";

export interface ContainerProps {
  className?: string;
  children: React.ReactNode;
  size?: "default" | "wide" | "narrow" | "full";
}

const SIZE_MAP = {
  default: "max-w-7xl 2xl:max-w-[1536px]",
  wide: "max-w-[1536px] 2xl:max-w-[1680px]",
  narrow: "max-w-5xl",
  full: "max-w-full",
};

export default function Container({
  className,
  children,
  size = "default",
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-10",
        SIZE_MAP[size],
        className,
      )}
    >
      {children}
    </div>
  );
}
