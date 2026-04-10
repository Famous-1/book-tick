import { useMemo, useState } from "react";
import { BookCover } from "../components/BookCover";
import { useReading } from "../context/ReadingContext";
import {
  booksFinishedThisMonth,
  formatHistoryWhen,
  sortHistory,
} from "../domain/readingLogic";
import { MaterialIcon } from "../components/MaterialIcon";
import { FilterChip } from "../components/ui/FilterChip";

type FilterId = "date" | "longest" | "favorites";

export function HistoryPage() {
  const { state, toggleFavorite } = useReading();
  const { history } = state;

  const [filter, setFilter] = useState<FilterId>("date");

  const sorted = useMemo(() => {
    if (filter === "favorites") {
      const faves = history.filter((h) => h.favorite);
      return sortHistory(faves, "date");
    }
    return sortHistory(history, filter);
  }, [history, filter]);

  const monthCount = useMemo(
    () => booksFinishedThisMonth(history),
    [history],
  );

  const hasFaves = history.some((h) => h.favorite);

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 sm:px-6 sm:pt-8">
      <div className="mb-6 sm:mb-8">
        <h2 className="mb-2 text-3xl font-extrabold text-on-surface sm:text-4xl">
          Your books
        </h2>
        <p className="font-medium text-on-surface-variant">You read these!</p>
      </div>

      <div className="-mx-1 mb-8 flex gap-2 overflow-x-auto pb-2 sm:mb-10 sm:gap-3">
        <FilterChip
          active={filter === "date"}
          onClick={() => setFilter("date")}
        >
          <MaterialIcon name="calendar_month" className="text-[18px] sm:text-[20px]" />
          New first
        </FilterChip>
        <FilterChip
          active={filter === "longest"}
          onClick={() => setFilter("longest")}
        >
          <MaterialIcon name="vertical_align_top" className="text-[18px] sm:text-[20px]" />
          Longest
        </FilterChip>
        <FilterChip
          active={filter === "favorites"}
          onClick={() => setFilter("favorites")}
        >
          <MaterialIcon name="stars" className="text-[18px] sm:text-[20px]" />
          Faves
        </FilterChip>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center sm:py-20">
          <div className="relative mb-6 flex h-40 w-40 items-center justify-center rounded-full bg-tertiary-container/30 sm:h-48 sm:w-48">
            <MaterialIcon name="menu_book" className="text-7xl text-tertiary/40 sm:text-8xl" />
          </div>
          <h3 className="mb-2 text-xl font-bold sm:text-2xl">No books yet</h3>
          <p className="max-w-xs text-on-surface-variant">
            {filter === "favorites" && hasFaves === false
              ? "Tap the star on a book to save a fave."
              : "Tap Go! on Home to start."}
          </p>
        </div>
      ) : (
        <div className="space-y-5 sm:space-y-6">
          {sorted.map((entry, index) => {
            const mins = Math.max(1, Math.round(entry.secondsRead / 60));
            return (
              <div
                key={entry.id}
                className="group relative overflow-hidden rounded-lg bg-surface-container-lowest p-5 shadow-sm transition-transform hover:scale-[1.02] sm:p-6"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(entry.id)}
                    className="shrink-0 rounded-full p-1.5 text-amber-500 transition-transform hover:scale-110 active:scale-95"
                    aria-label={
                      entry.favorite ? "Remove favorite" : "Add favorite"
                    }
                  >
                    <MaterialIcon
                      name="star"
                      filled={entry.favorite}
                      className="text-2xl"
                    />
                  </button>
                  <div className="flex shrink-0 items-center gap-1 rounded-full bg-primary-container/20 px-2.5 py-1 text-xs font-bold text-on-primary-container sm:px-3 sm:text-sm">
                    <MaterialIcon
                      name="check_circle"
                      filled
                      className="text-sm"
                    />
                    {entry.hitGoal ? "All done!" : "Yay!"}
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <BookCover
                    coverIndex={entry.coverIndex}
                    className="h-16 w-14 shrink-0 sm:h-[4.5rem] sm:w-16"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-lg font-bold sm:text-xl">
                      {entry.bookTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 rounded-full bg-tertiary-container/30 px-2.5 py-1 text-xs font-bold text-on-tertiary-container">
                        <MaterialIcon name="schedule" className="text-sm" />
                        {mins} min
                      </span>
                      <span className="text-xs font-semibold text-on-surface-variant">
                        {formatHistoryWhen(entry.endedAt)}
                      </span>
                    </div>
                  </div>
                </div>
                {index === 1 ? (
                  <MaterialIcon
                    name="auto_stories"
                    className="pointer-events-none absolute -bottom-2 -right-2 text-8xl opacity-10 transition-transform group-hover:scale-110"
                  />
                ) : null}
              </div>
            );
          })}

          <div className="mt-6 grid grid-cols-2 gap-4 sm:mt-8">
            <div className="relative col-span-2 overflow-hidden rounded-lg bg-tertiary p-5 text-on-tertiary sm:p-6">
              <div className="relative z-10">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-tertiary-fixed-dim sm:text-sm">
                  This month
                </p>
                <h4 className="text-4xl font-black sm:text-5xl">{monthCount}</h4>
                <p className="mt-2 text-sm text-tertiary-fixed-dim">books!</p>
              </div>
              <MaterialIcon
                name="trophy"
                className="pointer-events-none absolute -bottom-4 -right-4 text-9xl text-white/10"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
