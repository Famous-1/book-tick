import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getKidsBackgroundMusic } from "../audio/kidsBackgroundMusic";

const STORAGE_KEY = "book-tick-music-muted";

type MusicContextValue = {
  musicOn: boolean;
  toggleMusic: () => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const music = useMemo(() => getKidsBackgroundMusic(), []);
  const unlocked = useRef(false);
  const unlockFn = useRef<() => void>(() => {});

  const [musicOn, setMusicOn] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== "1";
    } catch {
      return true;
    }
  });

  const unlockAndStart = useCallback(() => {
    if (unlocked.current) return;
    unlocked.current = true;
    if (musicOn) {
      music.start();
    }
  }, [music, musicOn]);

  unlockFn.current = unlockAndStart;

  useEffect(() => {
    const onFirstPointer = () => {
      unlockFn.current();
    };
    window.addEventListener("pointerdown", onFirstPointer, { capture: true });
    return () =>
      window.removeEventListener("pointerdown", onFirstPointer, {
        capture: true,
      });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, musicOn ? "0" : "1");
    } catch {
      /* ignore */
    }
  }, [musicOn]);

  useEffect(() => {
    if (!musicOn) {
      music.stop();
      return;
    }
    if (unlocked.current) {
      music.start();
    }
  }, [music, musicOn]);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        music.setMuted(true);
      } else if (musicOn && unlocked.current && music.isRunning()) {
        music.setMuted(false);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [music, musicOn]);

  useEffect(() => {
    return () => {
      music.stop();
    };
  }, [music]);

  const toggleMusic = useCallback(() => {
    setMusicOn((on) => !on);
  }, []);

  const value = useMemo(
    () => ({
      musicOn,
      toggleMusic,
    }),
    [musicOn, toggleMusic],
  );

  return (
    <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    throw new Error("useMusic must be used within MusicProvider");
  }
  return ctx;
}
