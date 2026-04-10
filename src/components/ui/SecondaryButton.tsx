import type { ButtonHTMLAttributes, ReactNode } from "react";

type SecondaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "surface" | "outline";
};

export function SecondaryButton({
  children,
  className = "",
  variant = "surface",
  ...props
}: SecondaryButtonProps) {
  const base =
    variant === "outline"
      ? "border-2 border-outline-variant/30 bg-surface-container-lowest text-on-surface hover:border-primary-container"
      : "border-2 border-outline-variant/30 bg-surface-container-high text-on-surface hover:bg-error-container hover:text-on-error-container";

  return (
    <button
      type="button"
      className={`flex h-14 w-full items-center justify-center gap-2 rounded-full px-6 text-lg font-bold transition-all active:scale-95 sm:h-[3.75rem] ${base} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
