/**
 * Colorful illustrated avatars (DiceBear) — kid-friendly, Netflix-style picks.
 * @see https://www.dicebear.com/styles/
 */

export type KidAvatar = {
  id: string;
  /** Short name for screen readers */
  name: string;
  url: string;
};

const BASE = "https://api.dicebear.com/7.x";
const SIZE = 128;

/** Mix of big-smile, croodles, micah, notionists — bright circle backgrounds */
export const KID_AVATARS: KidAvatar[] = [
  {
    id: "milo",
    name: "Milo",
    url: `${BASE}/big-smile/png?seed=Milo&size=${SIZE}&backgroundColor=c0aede`,
  },
  {
    id: "zoe",
    name: "Zoe",
    url: `${BASE}/big-smile/png?seed=Zoe&size=${SIZE}&backgroundColor=ffd5dc`,
  },
  {
    id: "kai",
    name: "Kai",
    url: `${BASE}/big-smile/png?seed=Kai&size=${SIZE}&backgroundColor=bde4a8`,
  },
  {
    id: "nova",
    name: "Nova",
    url: `${BASE}/croodles/png?seed=Nova&size=${SIZE}&backgroundColor=ffdfbf`,
  },
  {
    id: "rio",
    name: "Rio",
    url: `${BASE}/croodles/png?seed=Rio&size=${SIZE}&backgroundColor=d1d4f9`,
  },
  {
    id: "luna",
    name: "Luna",
    url: `${BASE}/micah/png?seed=Luna&size=${SIZE}&backgroundColor=f9d5e5`,
  },
  {
    id: "otto",
    name: "Otto",
    url: `${BASE}/micah/png?seed=Otto&size=${SIZE}&backgroundColor=cffafe`,
  },
  {
    id: "pip",
    name: "Pip",
    url: `${BASE}/notionists/png?seed=Pip&size=${SIZE}&backgroundColor=fee2e2`,
  },
  {
    id: "sky",
    name: "Sky",
    url: `${BASE}/notionists/png?seed=Sky&size=${SIZE}&backgroundColor=e0f2fe`,
  },
  {
    id: "jun",
    name: "Jun",
    url: `${BASE}/big-smile/png?seed=Jun&size=${SIZE}&backgroundColor=fef3c7`,
  },
  {
    id: "bea",
    name: "Bea",
    url: `${BASE}/croodles/png?seed=Bea&size=${SIZE}&backgroundColor=ddd6fe`,
  },
  {
    id: "max",
    name: "Max",
    url: `${BASE}/big-smile/png?seed=Max&size=${SIZE}&backgroundColor=a7f3d0`,
  },
];

const STORAGE_KEY = "book-tick-kid-avatar-id";

export function getAvatarById(id: string): KidAvatar | undefined {
  return KID_AVATARS.find((a) => a.id === id);
}

export function loadSavedAvatarId(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return getAvatarById(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function saveAvatarId(id: string): void {
  try {
    if (getAvatarById(id)) {
      localStorage.setItem(STORAGE_KEY, id);
    }
  } catch {
    /* ignore */
  }
}

export function randomAvatarId(): string {
  const i = Math.floor(Math.random() * KID_AVATARS.length);
  return KID_AVATARS[i].id;
}

export function getInitialAvatarId(): string {
  const saved = loadSavedAvatarId();
  if (saved) return saved;
  const id = randomAvatarId();
  saveAvatarId(id);
  return id;
}
