import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActiveReadBanner } from "../components/ActiveReadBanner";
import { useReading } from "../context/ReadingContext";
import {
  sessionsThisCalendarWeek,
  weekBarFraction,
} from "../domain/readingLogic";
import { MaterialIcon } from "../components/MaterialIcon";
import { PrimaryButton } from "../components/ui/PrimaryButton";

const dayLabels = ["M", "T", "W", "T", "F", "S", "S"] as const;

const DURATIONS = [
  { label: "15 min", sec: 15 * 60 },
  { label: "30 min", sec: 30 * 60 },
  { label: "1 hr", sec: 60 * 60 },
] as const;

export function HomePage() {
  const navigate = useNavigate();
  const { state, startSession, endSession } = useReading();
  const { stats, history, activeSession } = state;

  const [bookTitle, setBookTitle] = useState("");
  const [durationSec, setDurationSec] = useState<number>(DURATIONS[1].sec);

  const totalMinutes = Math.floor(stats.totalSecondsRead / 60);
  const hoursDisplay =
    stats.totalSecondsRead < 3600
      ? "0"
      : (stats.totalSecondsRead / 3600).toFixed(1);

  const weekSessions = useMemo(
    () => sessionsThisCalendarWeek(history),
    [history],
  );

  const readingLevel = Math.min(
    99,
    Math.max(1, Math.floor(totalMinutes / 30) + 1),
  );

  const canGo = bookTitle.trim().length > 0;
  const hasActiveTimer = activeSession !== null;

  const handleGo = () => {
    if (!canGo) return;
    startSession(bookTitle, durationSec);
    navigate("/timer");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 pt-6 sm:space-y-12 sm:px-6 sm:pt-8">
      <section className="space-y-6 pt-2 text-center sm:pt-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold leading-tight text-on-surface sm:text-4xl">
            Hi there! 👋
          </h2>
          <p className="text-lg text-on-surface-variant sm:text-xl">
            {hasActiveTimer
              ? "Finish your book or start fresh."
              : "Let's read!"}
          </p>
        </div>

        {hasActiveTimer && activeSession ? (
          <ActiveReadBanner session={activeSession} onSaveSession={endSession} />
        ) : (
          <div className="hero-shadow rounded-[2rem] border-4 border-primary-container/20 bg-surface-container-lowest p-6 sm:rounded-[3rem] sm:p-8">
            <h3 className="mb-6 text-xl font-bold text-on-surface sm:mb-8 sm:text-2xl">
              Which book?
            </h3>
            <div className="space-y-5 sm:space-y-6">
              <div className="relative mx-auto max-w-lg">
                <input
                  className="h-16 w-full rounded-full border-2 border-transparent bg-surface-container-low px-9 pr-14 text-lg font-medium text-on-surface shadow-inner placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none focus:ring-0 sm:h-20 sm:px-10 sm:pr-16 sm:text-xl"
                  placeholder="Book name"
                  type="text"
                  aria-label="Book name"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                />
                <MaterialIcon
                  name="auto_stories"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-primary-container sm:right-6 sm:text-3xl"
                />
              </div>

              <div className="mx-auto flex max-w-lg flex-wrap justify-center gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => setDurationSec(d.sec)}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition-all active:scale-95 sm:px-5 sm:text-base ${
                      durationSec === d.sec
                        ? "bg-primary text-on-primary shadow-md"
                        : "border-2 border-outline-variant/40 bg-surface-container-low text-on-surface hover:border-primary-container"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <div className="group relative mx-auto max-w-lg overflow-hidden rounded-full">
                <PrimaryButton
                  pillowy
                  className="relative overflow-hidden disabled:opacity-40"
                  disabled={!canGo}
                  onClick={handleGo}
                >
                  <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
                  <MaterialIcon name="play_circle" className="relative text-3xl sm:text-4xl" />
                  <span className="relative text-xl font-black uppercase tracking-wider sm:text-2xl">
                    Go!
                  </span>
                </PrimaryButton>
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="relative flex items-center gap-4 overflow-hidden rounded-3xl border-2 border-tertiary/10 bg-tertiary-container/40 p-4 text-on-tertiary-container">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tertiary text-white shadow-sm">
          <MaterialIcon name="military_tech" className="text-2xl" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold leading-tight sm:text-lg">
            {stats.streakDays > 0 ? "Super reader!" : "Start a streak!"}
          </p>
          <p className="text-sm opacity-80">
            {stats.streakDays > 0
              ? `${stats.streakDays} day${stats.streakDays === 1 ? "" : "s"} in a row!`
              : "Read today!"}
          </p>
        </div>
        <MaterialIcon
          name="celebration"
          className="pointer-events-none absolute bottom-0 right-2 rotate-12 text-6xl opacity-5"
        />
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="relative flex h-36 flex-col justify-between overflow-hidden rounded-3xl border-2 border-primary-container/30 bg-primary-container/20 p-5 transition-colors hover:bg-primary-container/30 sm:h-40">
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-on-primary-container/70">
              Books
            </p>
            <p className="mt-1 text-3xl font-black text-on-primary-container sm:text-4xl">
              {stats.sessionsCompleted}
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-1 text-xs font-bold text-on-primary-container/60">
            <MaterialIcon name="trending_up" className="text-sm" />
            {weekSessions > 0 ? `+${weekSessions} this week` : "This week"}
          </div>
        </div>
        <div className="relative flex h-36 flex-col justify-between overflow-hidden rounded-3xl border-2 border-secondary-container/30 bg-secondary-container/20 p-5 transition-colors hover:bg-secondary-container/30 sm:h-40">
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-on-secondary-container/70">
              Minutes
            </p>
            <p className="mt-1 text-3xl font-black text-on-secondary-container sm:text-4xl">
              {totalMinutes}
            </p>
          </div>
          <div className="relative z-10 text-xs font-bold text-on-secondary-container/60">
            {totalMinutes > 0 ? "Yay! 🌟" : "Go!"}
          </div>
        </div>
        <div className="relative flex h-36 flex-col justify-between overflow-hidden rounded-3xl border-2 border-tertiary-container/30 bg-tertiary-container/20 p-5 transition-colors hover:bg-tertiary-container/30 sm:h-40">
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-on-tertiary-container/70">
              Hours
            </p>
            <p className="mt-1 text-3xl font-black text-on-tertiary-container sm:text-4xl">
              {hoursDisplay}
            </p>
          </div>
          <div className="relative z-10 text-xs font-bold text-on-tertiary-container/60">
            Level {readingLevel}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border-2 border-surface-container-highest/50 bg-surface-container-low/50 p-6 sm:rounded-[2.5rem] sm:p-8">
        <div className="mb-6 flex items-end justify-between sm:mb-8">
          <div>
            <h3 className="text-base font-bold sm:text-lg">This week</h3>
            <p className="text-sm text-on-surface-variant">
              Goal: {stats.weeklyGoalMinutes} min
            </p>
          </div>
          <MaterialIcon name="analytics" className="text-3xl text-primary/40" />
        </div>
        <div className="flex h-28 items-end justify-between gap-2 px-1 sm:gap-3 md:gap-6">
          {stats.weekMinutes.map((minutes, i) => {
            const frac = weekBarFraction(minutes, stats.weeklyGoalMinutes);
            const hit = minutes >= stats.weeklyGoalMinutes;
            const pct =
              frac <= 0 ? 0 : Math.max(4, Math.round(frac * 100));
            return (
              <div
                key={`${dayLabels[i]}-${i}`}
                className="flex flex-1 flex-col items-center gap-2 sm:gap-3"
              >
                <div className="relative flex h-24 w-full items-end overflow-hidden rounded-t-full bg-surface-container-highest">
                  <div
                    className={`relative w-full rounded-t-full ${
                      hit
                        ? "bg-secondary-container"
                        : "bg-primary-container/60"
                    }`}
                    style={{ height: `${pct}%` }}
                  >
                    {hit ? (
                      <MaterialIcon
                        name="star"
                        filled
                        className="absolute left-1/2 top-1 -translate-x-1/2 text-[10px] text-white"
                      />
                    ) : null}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant/60">
                  {dayLabels[i]}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
