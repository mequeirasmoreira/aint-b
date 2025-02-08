"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";

interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: (isDark: boolean) => void;
  isCollapsed?: boolean;
}

export function DarkModeToggle({ isDark, onToggle, isCollapsed = false }: DarkModeToggleProps) {
  return (
    <div
      onClick={() => onToggle(!isDark)}
      className={twMerge(
        "group flex items-center cursor-pointer transition-all duration-200 mx-2 rounded-[8px]",
        isCollapsed ? "justify-center py-3" : "pl-4 py-2",
        isDark
          ? "text-slate-100/70 hover:bg-white/10"
          : "text-gray-600 hover:bg-white"
      )}
    >
      <div className={`flex items-center ${isCollapsed ? "justify-center" : "flex-1"}`}>
        <span
          className={twMerge(
            "transition-colors",
            !isCollapsed && "mr-3",
            isDark
              ? "text-slate-100/70 group-hover:text-slate-100"
              : "text-gray-600 group-hover:text-slate-900/50"
          )}
        >
          {isDark ? (
            <MoonIcon className="w-5 h-5" />
          ) : (
            <SunIcon className="w-5 h-5" />
          )}
        </span>
        {!isCollapsed && (
          <span
            className={twMerge(
              "transition-colors text-sm",
              isDark
                ? "text-slate-100/70 group-hover:text-slate-100"
                : "text-gray-600 group-hover:text-slate-900/50"
            )}
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </span>
        )}
      </div>
    </div>
  );
}
