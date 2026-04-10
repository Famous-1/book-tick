import { useState } from "react";
import { Link } from "react-router-dom";
import { AvatarPickerModal } from "./AvatarPickerModal";
import { useMusic } from "../context/MusicContext";
import {
  getAvatarById,
  getInitialAvatarId,
  KID_AVATARS,
  saveAvatarId,
  type KidAvatar,
} from "../domain/kidAvatars";
import { MaterialIcon } from "./MaterialIcon";

export function Header() {
  const { musicOn, toggleMusic } = useMusic();
  const [avatarId, setAvatarId] = useState(getInitialAvatarId);
  const [pickerOpen, setPickerOpen] = useState(false);

  const current = getAvatarById(avatarId);
  const avatarSrc = current?.url ?? KID_AVATARS[0].url;

  const handleSelectAvatar = (a: KidAvatar) => {
    setAvatarId(a.id);
    saveAvatarId(a.id);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full shrink-0 rounded-b-xl bg-white px-4 py-3 shadow-[0_4px_20px_-4px_rgba(0,106,101,0.1)] dark:bg-slate-900 sm:px-6 sm:py-4 sm:rounded-b-[3rem]">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="group relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-primary-container ring-0 transition-transform duration-150 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Change avatar"
            >
              <img
                src={avatarSrc}
                alt=""
                className="h-full w-full object-cover"
                width={40}
                height={40}
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
                <MaterialIcon
                  name="edit"
                  className="text-lg text-white opacity-0 drop-shadow-md transition-opacity group-hover:opacity-100"
                />
              </span>
            </button>
            <Link
              to="/"
              className="min-w-0 transition-transform duration-150 hover:scale-105"
            >
              <h1 className="font-lexend text-xl font-black italic tracking-tight text-teal-700 dark:text-teal-400 sm:text-2xl">
                Book Tick
              </h1>
            </Link>
          </div>
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
      {pickerOpen ? (
        <AvatarPickerModal
          currentId={avatarId}
          onSelect={handleSelectAvatar}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}
    </>
  );
}
