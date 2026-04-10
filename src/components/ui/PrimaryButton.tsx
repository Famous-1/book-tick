import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  /** Extra shadow depth (home CTA style) */
  pillowy?: boolean;
};

export function PrimaryButton({
  children,
  className = "",
  pillowy = false,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      className={`flex h-16 w-full max-w-lg items-center justify-center gap-3 rounded-full bg-primary px-8 text-on-primary shadow-xl transition-all duration-150 hover:brightness-110 active:scale-95 sm:gap-4 sm:px-12 ${pillowy ? "pillowy-depth press-down" : "shadow-[0_6px_0_0_#004d49] active:translate-y-1 active:shadow-none"} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
