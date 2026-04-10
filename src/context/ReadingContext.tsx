import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  addMinutesToWeekDay,
  alignWeekToCurrent,
  simpleHash,
  updateStreak,
  localDayString,
} from "../domain/readingLogic";
import {
  COVER_VARIANTS,
  loadReadingState,
  saveReadingState,
} from "../domain/readingStorage";
import type {
  ActiveSession,
  HistoryEntry,
  ReadingAppState,
} from "../domain/readingTypes";

const MIN_SECONDS_FOR_STREAK = 45;

type Action =
  | { type: "START_SESSION"; bookTitle: string; durationSeconds: number }
  | { type: "TICK_DOWN" }
  | { type: "SET_PAUSED"; paused: boolean }
  | { type: "END_SESSION" }
  | { type: "TOGGLE_FAVORITE"; id: string };

function readingReducer(
  state: ReadingAppState,
  action: Action,
): ReadingAppState {
  switch (action.type) {
    case "START_SESSION": {
      const title = action.bookTitle.trim();
      if (!title) return state;
      const startedAt = new Date().toISOString();
      const coverIndex =
        simpleHash(title + startedAt) % COVER_VARIANTS.length;
      const activeSession: ActiveSession = {
        bookTitle: title,
        durationSeconds: action.durationSeconds,
        remainingSeconds: action.durationSeconds,
        paused: false,
        startedAt,
        coverIndex,
        status: "running",
      };
      return { ...state, activeSession };
    }

    case "TICK_DOWN": {
      const s = state.activeSession;
      if (!s || s.paused || s.status !== "running") return state;
      const r = s.remainingSeconds;
      if (r <= 0) return state;
      const next = r - 1;
      if (next === 0) {
        return {
          ...state,
          activeSession: {
            ...s,
            remainingSeconds: 0,
            paused: true,
            status: "completed",
          },
        };
      }
      return {
        ...state,
        activeSession: { ...s, remainingSeconds: next },
      };
    }

    case "SET_PAUSED": {
      const s = state.activeSession;
      if (!s || s.status === "completed") return state;
      return {
        ...state,
        activeSession: { ...s, paused: action.paused },
      };
    }

    case "END_SESSION": {
      const s = state.activeSession;
      if (!s) return state;

      const hitGoal = s.status === "completed";
      const secondsRead = hitGoal
        ? s.durationSeconds
        : Math.max(0, s.durationSeconds - s.remainingSeconds);

      if (secondsRead < 1) {
        return { ...state, activeSession: null };
      }

      const endedAt = new Date().toISOString();
      const sessionDay = localDayString();

      let stats = alignWeekToCurrent(state.stats);
      stats = {
        ...stats,
        sessionsCompleted: stats.sessionsCompleted + 1,
        totalSecondsRead: stats.totalSecondsRead + secondsRead,
      };

      if (secondsRead >= MIN_SECONDS_FOR_STREAK) {
        const st = updateStreak(stats, sessionDay);
        stats = { ...stats, streakDays: st.streakDays, lastReadDay: st.lastReadDay };
      }

      const minutesAdded = secondsRead / 60;
      stats = addMinutesToWeekDay(stats, minutesAdded, sessionDay);

      const entry: HistoryEntry = {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`,
        bookTitle: s.bookTitle,
        secondsRead,
        endedAt,
        hitGoal,
        coverIndex: s.coverIndex,
        favorite: false,
      };

      return {
        ...state,
        stats,
        history: [entry, ...state.history],
        activeSession: null,
      };
    }

    case "TOGGLE_FAVORITE": {
      return {
        ...state,
        history: state.history.map((h) =>
          h.id === action.id ? { ...h, favorite: !h.favorite } : h,
        ),
      };
    }

    default:
      return state;
  }
}

type ReadingContextValue = {
  state: ReadingAppState;
  startSession: (bookTitle: string, durationSeconds: number) => void;
  tickDown: () => void;
  setPaused: (paused: boolean) => void;
  endSession: () => void;
  toggleFavorite: (id: string) => void;
};

const ReadingContext = createContext<ReadingContextValue | null>(null);

export function ReadingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    readingReducer,
    undefined,
    () => loadReadingState(),
  );

  useEffect(() => {
    saveReadingState(state);
  }, [state]);

  const startSession = useCallback(
    (bookTitle: string, durationSeconds: number) => {
      dispatch({ type: "START_SESSION", bookTitle, durationSeconds });
    },
    [],
  );

  const tickDown = useCallback(() => {
    dispatch({ type: "TICK_DOWN" });
  }, []);

  const setPaused = useCallback((paused: boolean) => {
    dispatch({ type: "SET_PAUSED", paused });
  }, []);

  const endSession = useCallback(() => {
    dispatch({ type: "END_SESSION" });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_FAVORITE", id });
  }, []);

  const value = useMemo(
    () => ({
      state,
      startSession,
      tickDown,
      setPaused,
      endSession,
      toggleFavorite,
    }),
    [state, startSession, tickDown, setPaused, endSession, toggleFavorite],
  );

  return (
    <ReadingContext.Provider value={value}>{children}</ReadingContext.Provider>
  );
}

export function useReading() {
  const ctx = useContext(ReadingContext);
  if (!ctx) {
    throw new Error("useReading must be used within ReadingProvider");
  }
  return ctx;
}

/** Optional: for header without throwing if ever split providers */