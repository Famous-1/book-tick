import { COVER_VARIANTS } from "../domain/readingStorage";
import { MaterialIcon } from "./MaterialIcon";

type BookCoverProps = {
  coverIndex: number;
  className?: string;
};

export function BookCover({ coverIndex, className = "" }: BookCoverProps) {
  const v = COVER_VARIANTS[coverIndex % COVER_VARIANTS.length];
  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-md shadow-sm ${v.bg} ${className}`.trim()}
    >
      <MaterialIcon name={v.icon} filled className="text-4xl sm:text-5xl" />
    </div>
  );
}
