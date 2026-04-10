import { Link } from "react-router-dom";
import { AVATAR_URL } from "../assets";
import { useMusic } from "../context/MusicContext";
import { MaterialIcon } from "./MaterialIcon";

export function Header() {
  const { musicOn, toggleMusic } = useMusic();

  return (
    <header className="sticky top-0 z-40 w-full shrink-0 rounded-b-xl bg-white px-4 py-3 shadow-[0_4px_20px_-4px_rgba(0,106,101,0.1)] dark:bg-slate-900 sm:px-6 sm:py-4 sm:rounded-b-[3rem]">
      <div className="flex w-full items-center justify-between gap-2">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3 transition-transform duration-150 hover:scale-105"
        >
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-primary-container">
            <img
              src={AVATAR_URL}
              alt=""
              className="h-full w-full object-cover"
              width={40}
              height={40}
            />
          </div>
          <h1 className="font-lexend text-xl font-black italic tracking-tight text-teal-700 dark:text-teal-400 sm:text-2xl">
            Book Tick
          </h1>
        </Link>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={toggleMusic}
            className="flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition-transform duration-150 hover:scale-105 active:scale-95 dark:text-slate-400"
            aria-pressed={musicOn}
            aria-label={musicOn ? "Turn music off" : "Turn music on"}
          >
            <MaterialIcon
              name={musicOn ? "music_note" : "music_off"}
              className="text-2xl"
            />
          </button>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition-transform duration-150 hover:scale-105 active:scale-95 dark:text-slate-400"
            aria-label="Settings"
          >
            <MaterialIcon name="settings" className="text-2xl" />
          </button>
        </div>
      </div>
    </header>
  );
}
