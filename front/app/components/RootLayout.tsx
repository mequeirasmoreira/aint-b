"use client";

import { useState } from "react";
import { Sidebar } from "./SideBar/SideBar";
import { Header } from "./Header/Header";
import { useTheme } from "../contexts/ThemeContext";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="flex h-screen bg-gray-50 dark:bg-neutral-900 dark">
        <Sidebar
          isDarkMode={isDarkMode}
          onDarkModeChange={toggleDarkMode}
          isCollapsed={isSidebarCollapsed}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            isDarkMode={isDarkMode}
            isSidebarCollapsed={isSidebarCollapsed}
            onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
          <main className={`flex-1 overflow-auto p-6 ${isDarkMode ? "bg-neutral-900" : "bg-slate-100"}`}>
            {typeof children === "function" ? children({ isDarkMode }) : children}
          </main>
        </div>
      </div>
    </div>
  );
}
