import type { HistoryEntry, ReadingStats } from "./readingTypes";

export function localDayString(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Monday = 0 ... Sunday = 6 in our weekMinutes array */
export function dayIndexInWeek(d = new Date()): number {
  const day = d.getDay();
  return day === 0 ? 6 : day - 1;
}

export function parseLocalDay(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function mondayOfWeekContaining(day: string): string {
  const date = parseLocalDay(day);
  const idx = dayIndexInWeek(date);
  date.setDate(date.getDate() - idx);
  return localDayString(date);
}

export function addLocalDays(day: string, delta: number): string {
  const d = parseLocalDay(day);
  d.setDate(d.getDate() + delta);
  return localDayString(d);
}

export function updateStreak(
  prev: Pick<ReadingStats, "streakDays" | "lastReadDay">,
  sessionDay: string,
): { streakDays: number; lastReadDay: string } {
  if (!prev.lastReadDay) {
    return { streakDays: 1, lastReadDay: sessionDay };
  }
  if (prev.lastReadDay === sessionDay) {
    return { streakDays: prev.streakDays, lastReadDay: sessionDay };
  }
  const prevPlusOne = addLocalDays(prev.lastReadDay, 1);
  if (prevPlusOne === sessionDay) {
    return { streakDays: prev.streakDays + 1, lastReadDay: sessionDay };
  }
  return { streakDays: 1, lastReadDay: sessionDay };
}

export function alignWeekToCurrent(
  stats: ReadingStats,
  today = localDayString(),
): ReadingStats {
  const monday = mondayOfWeekContaining(today);
  if (stats.weekStart === monday) return stats;
  return {
    ...stats,
    weekStart: monday,
    weekMinutes: [0, 0, 0, 0, 0, 0, 0],
  };
}

export function addMinutesToWeekDay(
  stats: ReadingStats,
  minutes: number,
  day = localDayString(),
): ReadingStats {
  const s = alignWeekToCurrent(stats, day);
  const monday = mondayOfWeekContaining(day);
  const idx = dayIndexInWeek(parseLocalDay(day));
  const next = [...s.weekMinutes] as ReadingStats["weekMinutes"];
  next[idx] = Math.round((next[idx] + minutes) * 10) / 10;
  return { ...s, weekStart: monday, weekMinutes: next };
}

export function formatHistoryWhen(iso: string): string {
  const then = new Date(iso);
  const today = new Date();
  const t0 = localDayString(today);
  const tThen = localDayString(then);
  if (tThen === t0) return "Today";
  if (tThen === addLocalDays(t0, -1)) return "Yesterday";
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffMs = startOfDay(today) - startOfDay(then);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays < 7 && diffDays > 0) return `${diffDays} days ago`;
  return then.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function sessionsStartedOnOrAfterDay(
  entries: HistoryEntry[],
  day: string,
): number {
  const start = parseLocalDay(day).getTime();
  return entries.filter((e) => new Date(e.endedAt).getTime() >= start).length;
}

export function sessionsThisCalendarWeek(entries: HistoryEntry[]): number {
  const monday = mondayOfWeekContaining(localDayString());
  const start = parseLocalDay(monday).getTime();
  return entries.filter((e) => new Date(e.endedAt).getTime() >= start).length;
}

export function booksFinishedThisMonth(entries: HistoryEntry[]): number {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  return entries.filter((e) => {
    const d = new Date(e.endedAt);
    return d.getFullYear() === y && d.getMonth() === m;
  }).length;
}

export function sortHistory(
  entries: HistoryEntry[],
  mode: "date" | "longest" | "favorites",
): HistoryEntry[] {
  const copy = [...entries];
  if (mode === "date") {
    copy.sort(
      (a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime(),
    );
  } else if (mode === "longest") {
    copy.sort((a, b) => b.secondsRead - a.secondsRead);
  } else {
    copy.sort((a, b) => {
      if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
      return new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime();
    });
  }
  return copy;
}

/** 0–1 height for bar vs weekly goal */
export function weekBarFraction(minutes: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(1, minutes / goal);
}

export function simpleHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
