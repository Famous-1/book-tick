export type HistoryEntry = {
  id: string;
  bookTitle: string;
  secondsRead: number;
  endedAt: string;
  /** Countdown reached 0 */
  hitGoal: boolean;
  /** Pick cover art variant */
  coverIndex: number;
  favorite: boolean;
};

export type ActiveSession = {
  bookTitle: string;
  durationSeconds: number;
  remainingSeconds: number;
  paused: boolean;
  startedAt: string;
  coverIndex: number;
  /** Countdown finished; waiting for save + home */
  status: "running" | "completed";
};

export type ReadingStats = {
  /** Finished sessions (each Done or timer complete) */
  sessionsCompleted: number;
  totalSecondsRead: number;
  streakDays: number;
  /** Local calendar day YYYY-MM-DD of last session that counted for streak */
  lastReadDay: string | null;
  /** Monday YYYY-MM-DD of the week `weekMinutes` belongs to */
  weekStart: string;
  /** Mon..Sun minutes read */
  weekMinutes: [number, number, number, number, number, number, number];
  weeklyGoalMinutes: number;
};

export type ReadingAppState = {
  version: 1;
  stats: ReadingStats;
  history: HistoryEntry[];
  activeSession: ActiveSession | null;
};
