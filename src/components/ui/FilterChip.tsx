import type { ButtonHTMLAttributes, ReactNode } from "react";

type FilterChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  active?: boolean;
};

export function FilterChip({
  children,
  active = false,
  className = "",
  ...props
}: FilterChipProps) {
  return (
    <button
      type="button"
      className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all active:scale-95 sm:px-6 sm:py-3 sm:text-base ${
        active
          ? "bg-primary text-white shadow-lg"
          : "border-2 border-transparent bg-surface-container-lowest text-on-surface hover:border-primary-container"
      } ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
