import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookCover } from "../components/BookCover";
import { useReading } from "../context/ReadingContext";
import { MaterialIcon } from "../components/MaterialIcon";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { SecondaryButton } from "../components/ui/SecondaryButton";

function formatCountdown(totalSeconds: number): { m: string; s: string } {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return {
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
  };
}

export function TimerPage() {
  const navigate = useNavigate();
  const { state, tickDown, setPaused, endSession } = useReading();
  const session = state.activeSession;

  useEffect(() => {
    if (!session) {
      navigate("/", { replace: true });
    }
  }, [session, navigate]);

  useEffect(() => {
    if (!session || session.paused || session.status !== "running") {
      return undefined;
    }
    if (session.remainingSeconds <= 0) {
      return undefined;
    }
    const id = window.setInterval(() => {
      tickDown();
    }, 1000);
    return () => clearInterval(id);
  }, [
    session?.paused,
    session?.status,
    session?.bookTitle,
    session?.durationSeconds,
    tickDown,
  ]);

  if (!session) {
    return null;
  }

  const { m, s } = formatCountdown(session.remainingSeconds);
  const completed = session.status === "completed";

  const finishAndHome = () => {
    endSession();
    navigate("/", { replace: true });
  };

  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute left-4 top-8 -z-0 rotate-12 text-tertiary opacity-20 sm:left-6 sm:top-10">
        <MaterialIcon name="menu_book" className="text-6xl" />
      </div>
      <div className="pointer-events-none absolute bottom-36 right-4 -z-0 -rotate-12 text-secondary opacity-20 sm:bottom-40 sm:right-6">
        <MaterialIcon name="temp_preferences_eco" className="text-7xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center space-y-7 sm:space-y-8">
        <div className="flex w-full items-center gap-4 rounded-lg border border-outline-variant/15 bg-surface-container-lowest p-4 shadow-sm sm:p-5">
          <BookCover
            coverIndex={session.coverIndex}
            className="h-[4.5rem] w-14 shrink-0 sm:h-20 sm:w-16"
          />
          <div className="min-w-0 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">
              Your book
            </span>
            <h2 className="text-lg font-black leading-tight text-on-surface sm:text-xl">
              {session.bookTitle}
            </h2>
          </div>
        </div>

        <div className="group relative mt-2">
          <div className="absolute -inset-6 rounded-full bg-primary-container/20 blur-2xl" />
          <div className="relative flex h-64 w-64 flex-col items-center justify-center rounded-full border-[12px] border-primary bg-surface-container-lowest shadow-xl sm:h-72 sm:w-72 sm:border-[14px]">
            <span className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-tertiary">
              {completed ? "Done!" : "Time left"}
            </span>
            <div className="flex items-center font-headline text-5xl font-black tracking-tighter text-on-surface sm:text-7xl">
              <span>{m}</span>
              <span
                className={`mx-1 text-primary/60 sm:mx-1 ${completed || session.paused ? "" : "animate-pulse"}`}
              >
                :
              </span>
              <span>{s}</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-sm font-black text-secondary sm:mt-4">
              <MaterialIcon name="auto_awesome" filled className="text-lg" />
              <span>
                {completed
                  ? "You did it!"
                  : session.paused
                    ? "Paused"
                    : "Nice!"}
              </span>
            </div>
          </div>
          <div className="absolute -right-2 -top-2 flex h-12 w-12 rotate-12 items-center justify-center rounded-full border-4 border-white bg-secondary text-on-secondary shadow-lg transition-transform group-hover:scale-110 sm:h-14 sm:w-14">
            <MaterialIcon
              name="workspace_premium"
              filled
              className="text-2xl sm:text-3xl"
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 pt-4 sm:gap-5 sm:pt-6">
          {completed ? (
            <PrimaryButton onClick={finishAndHome}>
              <MaterialIcon name="home" filled className="text-3xl sm:text-4xl" />
              <span className="text-xl font-black">Home</span>
            </PrimaryButton>
          ) : (
            <PrimaryButton
              onClick={() => setPaused(!session.paused)}
            >
              <MaterialIcon
                name={session.paused ? "play_circle" : "pause_circle"}
                filled
                className="text-3xl sm:text-4xl"
              />
              <span className="text-xl font-black">
                {session.paused ? "Go" : "Pause"}
              </span>
            </PrimaryButton>
          )}
          {!completed ? (
            <SecondaryButton type="button" onClick={finishAndHome}>
              <MaterialIcon name="stop_circle" className="text-2xl" />
              <span>Done</span>
            </SecondaryButton>
          ) : null}
        </div>
      </div>
    </div>
  );
}
