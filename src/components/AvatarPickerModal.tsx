import { useEffect } from "react";
import {
  KID_AVATARS,
  type KidAvatar,
} from "../domain/kidAvatars";
import { MaterialIcon } from "./MaterialIcon";

type AvatarPickerModalProps = {
  currentId: string;
  onSelect: (avatar: KidAvatar) => void;
  onClose: () => void;
};

export function AvatarPickerModal({
  currentId,
  onSelect,
  onClose,
}: AvatarPickerModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 pb-28 backdrop-blur-sm sm:items-center sm:pb-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatar-picker-title"
      onClick={onClose}
    >
      <div
        className="max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl dark:bg-slate-900 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2
            id="avatar-picker-title"
            className="font-lexend text-xl font-black text-on-surface sm:text-2xl"
          >
            Pick a face
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-colors hover:bg-surface-container-highest"
            aria-label="Close"
          >
            <MaterialIcon name="close" className="text-2xl" />
          </button>
        </div>
        <p className="mb-5 text-sm text-on-surface-variant">
          Tap one — you can change it anytime.
        </p>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 sm:gap-5">
          {KID_AVATARS.map((avatar) => {
            const selected = avatar.id === currentId;
            return (
              <button
                key={avatar.id}
                type="button"
                onClick={() => {
                  onSelect(avatar);
                  onClose();
                }}
                className={`flex flex-col items-center gap-2 rounded-2xl p-2 transition-transform active:scale-95 ${
                  selected
                    ? "bg-primary-container/30 ring-2 ring-primary"
                    : "bg-surface-container-low hover:bg-surface-container-high"
                }`}
                aria-label={`Use ${avatar.name}`}
                aria-pressed={selected}
              >
                <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-white shadow-md sm:h-[4.5rem] sm:w-[4.5rem]">
                  <img
                    src={avatar.url}
                    alt=""
                    width={72}
                    height={72}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="text-xs font-bold text-on-surface">{avatar.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
