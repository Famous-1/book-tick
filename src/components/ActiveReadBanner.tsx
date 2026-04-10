import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ActiveSession } from "../domain/readingTypes";
import { BookCover } from "./BookCover";
import { MaterialIcon } from "./MaterialIcon";
import { PrimaryButton } from "./ui/PrimaryButton";
import { SecondaryButton } from "./ui/SecondaryButton";

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type ActiveReadBannerProps = {
  session: ActiveSession;
  onSaveSession: () => void;
};

export function ActiveReadBanner({
  session,
  onSaveSession,
}: ActiveReadBannerProps) {
  const navigate = useNavigate();
  const [confirmNew, setConfirmNew] = useState(false);

  const isFinished = session.status === "completed";
  const secsRead = Math.max(
    0,
    session.durationSeconds - session.remainingSeconds,
  );
  const minsRead = Math.floor(secsRead / 60);

  const handleContinue = () => {
    navigate("/timer");
  };

  const handleNewBook = () => {
    setConfirmNew(true);
  };

  const handleConfirmSaveAndNew = () => {
    onSaveSession();
    setConfirmNew(false);
  };

  return (
    <div className="rounded-[2rem] border-4 border-primary bg-surface-container-lowest p-5 shadow-lg sm:rounded-[3rem] sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
        <BookCover
          coverIndex={session.coverIndex}
          className="mx-auto h-20 w-16 shrink-0 sm:mx-0 sm:h-24 sm:w-20"
        />
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            {isFinished ? "Timer done!" : "Still reading"}
          </p>
          <h3 className="mt-1 text-xl font-black text-on-surface sm:text-2xl">
            {session.bookTitle}
          </h3>
          {!isFinished ? (
            <p className="mt-2 text-lg font-bold text-on-surface-variant">
              {session.paused ? "Paused · " : ""}
              {formatClock(session.remainingSeconds)} left
            </p>
          ) : (
            <p className="mt-2 text-lg font-bold text-secondary">
              You did it! Save your read.
            </p>
          )}
        </div>
      </div>

      {confirmNew ? (
        <div className="mt-6 space-y-4 rounded-2xl border-2 border-outline-variant/30 bg-surface-container-low p-4">
          <p className="text-center text-sm font-bold text-on-surface sm:text-base">
            {minsRead > 0
              ? `We’ll save ${minsRead} min first. Then you can pick a new book.`
              : secsRead >= 60
                ? "We’ll save your time, then you can pick a new book."
                : "We’ll end this read, then you can pick a new book."}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <PrimaryButton className="sm:max-w-xs" onClick={handleConfirmSaveAndNew}>
              <MaterialIcon name="check_circle" filled className="text-2xl" />
              <span className="text-lg font-black">OK</span>
            </PrimaryButton>
            <SecondaryButton
              type="button"
              className="sm:max-w-xs"
              onClick={() => setConfirmNew(false)}
            >
              <span>Not now</span>
            </SecondaryButton>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          {isFinished ? (
            <PrimaryButton pillowy className="sm:max-w-xs" onClick={onSaveSession}>
              <MaterialIcon name="check_circle" filled className="text-3xl" />
              <span className="text-xl font-black">Save read</span>
            </PrimaryButton>
          ) : (
            <>
              <PrimaryButton pillowy className="sm:max-w-xs" onClick={handleContinue}>
                <MaterialIcon name="play_circle" filled className="text-3xl" />
                <span className="text-xl font-black">Continue</span>
              </PrimaryButton>
              <SecondaryButton
                type="button"
                className="border-primary/30 sm:max-w-xs"
                onClick={handleNewBook}
              >
                <MaterialIcon name="add_circle" className="text-2xl" />
                <span>New book</span>
              </SecondaryButton>
            </>
          )}
        </div>
      )}
    </div>
  );
}
