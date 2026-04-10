import type { ActiveSession, HistoryEntry, ReadingAppState } from "./readingTypes";
import { localDayString, mondayOfWeekContaining } from "./readingLogic";

const STORAGE_KEY = "book-tick-reading-v1";

export const COVER_VARIANTS = [
  { icon: "menu_book" as const, bg: "bg-amber-200 text-amber-900" },
  { icon: "auto_stories" as const, bg: "bg-sky-200 text-sky-900" },
  { icon: "local_library" as const, bg: "bg-rose-200 text-rose-900" },
  { icon: "pets" as const, bg: "bg-lime-200 text-lime-900" },
  { icon: "castle" as const, bg: "bg-violet-200 text-violet-900" },
  { icon: "rocket_launch" as const, bg: "bg-orange-200 text-orange-900" },
  { icon: "forest" as const, bg: "bg-emerald-200 text-emerald-900" },
  { icon: "emoji_nature" as const, bg: "bg-fuchsia-200 text-fuchsia-900" },
];

export function defaultReadingState(): ReadingAppState {
  const today = localDayString();
  const monday = mondayOfWeekContaining(today);
  return {
    version: 1,
    stats: {
      sessionsCompleted: 0,
      totalSecondsRead: 0,
      streakDays: 0,
      lastReadDay: null,
      weekStart: monday,
      weekMinutes: [0, 0, 0, 0, 0, 0, 0],
      weeklyGoalMinutes: 60,
    },
    history: [],
    activeSession: null,
  };
}

function normalizeHistory(raw: unknown): HistoryEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((h: HistoryEntry) => ({
    ...h,
    favorite: Boolean(h.favorite),
  }));
}

function normalizeActive(raw: unknown): ActiveSession | null {
  if (!raw || typeof raw !== "object") return null;
  const a = raw as ActiveSession & { status?: string };
  const status =
    a.status === "completed"
      ? "completed"
      : a.status === "running"
        ? "running"
        : a.remainingSeconds === 0
          ? "completed"
          : "running";
  return {
    bookTitle: String(a.bookTitle ?? ""),
    durationSeconds: Number(a.durationSeconds) || 0,
    remainingSeconds: Number(a.remainingSeconds) || 0,
    paused: Boolean(a.paused),
    startedAt: String(a.startedAt ?? new Date().toISOString()),
    coverIndex: Number(a.coverIndex) || 0,
    status,
  };
}

export function loadReadingState(): ReadingAppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultReadingState();
    const parsed = JSON.parse(raw) as Partial<ReadingAppState>;
    if (parsed?.version !== 1 || !parsed.stats || !Array.isArray(parsed.history)) {
      return defaultReadingState();
    }

    const today = localDayString();
    const monday = mondayOfWeekContaining(today);
    let stats = { ...parsed.stats };
    if (stats.weekStart !== monday) {
      stats = {
        ...stats,
        weekStart: monday,
        weekMinutes: [0, 0, 0, 0, 0, 0, 0],
      };
    }

    return {
      version: 1,
      stats,
      history: normalizeHistory(parsed.history),
      activeSession: normalizeActive(parsed.activeSession),
    };
  } catch {
    return defaultReadingState();
  }
}

export function saveReadingState(state: ReadingAppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode */
  }
}
