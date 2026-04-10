import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";

/** Bottom padding so content clears the fixed nav (nav height + safe area). */
const MAIN_BOTTOM_PAD = "pb-[calc(7rem+env(safe-area-inset-bottom))]";

export function AppShell() {
  return (
    <div className="min-h-dvh bg-[#c5d0e8] dark:bg-slate-950">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-surface-dim font-body text-on-surface shadow-none lg:my-6 lg:min-h-[min(100dvh,56rem)] lg:overflow-hidden lg:rounded-[2.5rem] lg:shadow-2xl">
        <Header />
        <main className={`flex min-h-0 flex-1 flex-col ${MAIN_BOTTOM_PAD}`}>
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
