"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface MenuSectionProps {
  title: string;
  children: React.ReactNode;
  isDark: boolean;
  isCollapsed: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  alwaysOpen?: boolean;
  className?: string;
}

export function MenuSection({
  title,
  children,
  isDark,
  isCollapsed,
  isOpen = true,
  onToggle,
  alwaysOpen = false,
  className = "",
}: MenuSectionProps) {
  const showChevron = !alwaysOpen && (!isCollapsed || !isOpen);
  const contentVisible = alwaysOpen || isOpen;

  return (
    <div className={`mt-4 ${className}`}>
      <button
        onClick={alwaysOpen ? undefined : onToggle}
        className={`flex items-center w-full text-xs font-semibold tracking-wider ${
          isCollapsed 
            ? "justify-center px-2" 
            : "justify-between px-4"
        } py-2 ${
          isDark ? "text-neutral-400" : "text-gray-500"
        } ${!alwaysOpen && "hover:text-gray-700 dark:hover:text-neutral-300 cursor-pointer"}`}
      >
        {!isCollapsed && title}
        {showChevron && (
          <div className={isCollapsed ? "flex items-center justify-center w-8 h-8" : ""}>
            {isOpen ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              <ChevronUpIcon className="w-4 h-4" />
            )}
          </div>
        )}
      </button>
      <div
        className={`space-y-1 overflow-hidden transition-all duration-200 ${
          contentVisible ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
