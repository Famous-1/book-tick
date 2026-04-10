import { NavLink } from "react-router-dom";
import { MaterialIcon } from "./MaterialIcon";

const tabClass =
  "flex min-h-[3.25rem] min-w-[4.5rem] flex-col items-center justify-center gap-0.5 rounded-[2rem] px-5 py-2 text-center transition-all duration-150";

const inactiveClass =
  "text-slate-400 hover:bg-teal-50 dark:text-slate-500 dark:hover:bg-teal-900/20";

const activeClass =
  "scale-110 bg-teal-100 font-semibold text-teal-800 dark:bg-teal-900/40 dark:text-teal-200";

export function BottomNav() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
      <nav className="pointer-events-auto flex w-full max-w-[430px] items-center justify-around rounded-t-[3rem] border-t border-outline-variant/10 bg-white/90 px-3 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] backdrop-blur-lg dark:bg-slate-900/90 sm:px-4 sm:pb-6 sm:pt-3">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${tabClass} font-lexend text-[12px] ${isActive ? activeClass : inactiveClass}`
          }
        >
          {({ isActive }) => (
            <>
              <MaterialIcon
                name="home_app_logo"
                className="text-[22px] leading-none"
                filled={isActive}
              />
              <span>Home</span>
            </>
          )}
        </NavLink>
        <NavLink
          to="/timer"
          className={({ isActive }) =>
            `${tabClass} font-lexend text-[12px] ${isActive ? `${activeClass} font-bold` : inactiveClass}`
          }
        >
          {({ isActive }) => (
            <>
              <MaterialIcon
                name="schedule"
                className="text-[22px] leading-none"
                filled={isActive}
              />
              <span>Time</span>
            </>
          )}
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `${tabClass} font-lexend text-[12px] ${isActive ? activeClass : inactiveClass}`
          }
        >
          {({ isActive }) => (
            <>
              <MaterialIcon
                name="menu_book"
                className="text-[22px] leading-none"
                filled={isActive}
              />
              <span>Books</span>
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );
}
