"use client";

import { SearchBar } from "./SearchBar";
import { DateRangeSelector } from "./DateRangeSelector";
import { SidebarToggle } from "./SidebarToggle";

interface HeaderProps {
  isDarkMode?: boolean;
  isSidebarCollapsed: boolean;
  onSidebarToggle: () => void;
}

export function Header({
  isDarkMode = false,
  isSidebarCollapsed,
  onSidebarToggle,
}: HeaderProps) {
  return (
    <header
      className={`flex items-center justify-between px-4 py-2.5 ${
        isDarkMode ? "bg-neutral-900" : "bg-white"
      } `}
    >
      <div className="flex items-center gap-3">
        <SidebarToggle
          isDarkMode={isDarkMode}
          isCollapsed={isSidebarCollapsed}
          onToggle={onSidebarToggle}
        />
        <SearchBar isDarkMode={isDarkMode} />
      </div>

      <DateRangeSelector isDarkMode={isDarkMode} />
    </header>
  );
}
