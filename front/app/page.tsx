"use client";

import { useState } from "react";
import { Sidebar } from "./components/SideBar/SideBar";
import { Header } from "./components/Header/Header";
import { useTheme } from "./contexts/ThemeContext";
import { redirect } from "next/navigation";
import RootLayout from "./components/RootLayout";

export default function AppLayout() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <RootLayout>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        {/* Conteúdo específico da página inicial */}
      </div>
    </RootLayout>
  );
}
