"use client";

import {
  Squares2X2Icon as DashboardOutline,
  WalletIcon as WalletOutline,
  CubeIcon as AssetsOutline,
  ClipboardDocumentListIcon as RecordsOutline,
  ChartBarIcon as ChartOutline,
  FlagIcon as GoalsOutline,
  MagnifyingGlassIcon as ExploreOutline,
  ArrowsRightLeftIcon as CompareOutline,
  PresentationChartLineIcon as IndicatorsOutline,
  NewspaperIcon as NewsOutline,
  CalculatorIcon as SimulationsOutline,
  Cog6ToothIcon as SettingsOutline,
  QuestionMarkCircleIcon as HelpOutline,
} from "@heroicons/react/24/outline";

import {
  Squares2X2Icon as DashboardSolid,
  WalletIcon as WalletSolid,
  CubeIcon as AssetsSolid,
  ClipboardDocumentListIcon as RecordsSolid,
  ChartBarIcon as ChartSolid,
  FlagIcon as GoalsSolid,
  MagnifyingGlassIcon as ExploreSolid,
  ArrowsRightLeftIcon as CompareSolid,
  PresentationChartLineIcon as IndicatorsSolid,
  NewspaperIcon as NewsSolid,
  CalculatorIcon as SimulationsSolid,
  Cog6ToothIcon as SettingsSolid,
  QuestionMarkCircleIcon as HelpSolid,
} from "@heroicons/react/24/solid";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { MenuItem } from "./MenuItem";
import { DarkModeToggle } from "./DarkModeToggle";
import { UserProfile } from "./UserProfile";
import { MenuSection } from "./MenuSection";

interface SidebarProps {
  isDarkMode: boolean;
  onDarkModeChange: (isDark: boolean) => void;
  isCollapsed: boolean;
}

// Mapeamento de rotas para itens do menu
const routeToMenuItem: { [key: string]: string } = {
  "/geral/dashboard": "Dashboard",
  "/geral/carteiras": "Carteiras",
  "/geral/ativos": "Ativos",
  "/geral/registros": "Registros",
  "/geral/rentabilidade": "Rentabilidade",
  "/geral/metas": "Metas",
  "/analise/comparar": "Comparar",
  "/analise/indicadores": "Indicadores",
  "/analise/noticias": "Notícias",
  "/preferencias/configuracoes": "Configurações",
  "/ajuda": "Ajuda"
};

// Mapeamento de rotas para seções
const routeToSection: { [key: string]: string } = {
  "/geral": "GERAL",
  "/analise": "ANÁLISE",
  "/preferencias": "PREFERÊNCIAS"
};

export function Sidebar({
  isDarkMode,
  onDarkModeChange,
  isCollapsed,
}: SidebarProps) {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("");
  const [openSection, setOpenSection] = useState("");

  // Atualiza o item ativo e a seção baseado na rota atual
  useEffect(() => {
    // Encontra o item do menu correspondente à rota atual
    const menuItem = routeToMenuItem[pathname] || "";
    setActiveItem(menuItem);

    // Encontra a seção correspondente à rota atual
    const section = Object.entries(routeToSection).find(([route]) => 
      pathname.startsWith(route)
    );
    if (section) {
      setOpenSection(section[1]);
    }
  }, [pathname]);

  const handleSectionToggle = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };

  const getIcon = (
    OutlineIcon: React.ElementType,
    SolidIcon: React.ElementType,
    itemName: string
  ) => {
    const Icon = activeItem === itemName ? SolidIcon : OutlineIcon;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-neutral-800">
      <div
        className={`flex flex-col transition-all duration-300 border-r-2 ${
          isDarkMode ? "bg-neutral-900" : "bg-slate-100"
        } ${isCollapsed ? "w-16" : "w-64"}`}
      >
        {/* Logo */}
        <div
          className={`flex items-center gap-3 transition-all duration-300 py-4 ${
            isCollapsed ? "justify-center" : "px-4"
          }`}
        >
          <div
            className={`p-2 rounded-xl bg-gradient-to-br ${
              isDarkMode
                ? "from-emerald-600 to-emerald-800"
                : "from-emerald-500 to-emerald-700"
            } transition-colors duration-200`}
          >
            <ChartOutline className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <span
              className={`text-xl font-bold tracking-tight ${
                isDarkMode ? "text-white" : "text-gray-800"
              } transition-colors duration-200`}
            >
              Minha Gestão
            </span>
          )}
        </div>

        {/* Menu Principal */}
        <div className={`flex-1 ${isCollapsed ? "" : "overflow-y-auto"} py-2`}>
          {/* GERAL */}
          <MenuSection
            title="GERAL"
            isDark={isDarkMode}
            isCollapsed={isCollapsed}
            isOpen={openSection === "GERAL"}
            onToggle={() => handleSectionToggle("GERAL")}
          >
            <MenuItem
              icon={getIcon(DashboardOutline, DashboardSolid, "Dashboard")}
              text="Dashboard"
              isActive={activeItem === "Dashboard"}
              isDark={isDarkMode}
              onClick={() => setActiveItem("Dashboard")}
              isCollapsed={isCollapsed}
              href="/geral/dashboard"
            />
            <MenuItem
              icon={getIcon(WalletOutline, WalletSolid, "Carteiras")}
              text="Carteiras"
              isActive={activeItem === "Carteiras"}
              isDark={isDarkMode}
              onClick={() => setActiveItem("Carteiras")}
              isCollapsed={isCollapsed}
              href="/geral/carteiras"
            />
            <MenuItem
              icon={getIcon(AssetsOutline, AssetsSolid, "Ativos")}
              text="Ativos"
              isActive={activeItem === "Ativos"}
              isDark={isDarkMode}
              onClick={() => setActiveItem("Ativos")}
              isCollapsed={isCollapsed}
              href="/geral/ativos"
            />
            <MenuItem
              icon={getIcon(RecordsOutline, RecordsSolid, "Registros")}
              text="Registros"
              isActive={activeItem === "Registros"}
              isDark={isDarkMode}
              onClick={() => setActiveItem("Registros")}
              isCollapsed={isCollapsed}
              href="/geral/registros"
            />
            <MenuItem
              icon={getIcon(ChartOutline, ChartSolid, "Rentabilidade")}
              text="Rentabilidade"
              isActive={activeItem === "Rentabilidade"}
              isDark={isDarkMode}
              onClick={() => setActiveItem("Rentabilidade")}
              isCollapsed={isCollapsed}
              href="/geral/rentabilidade"
            />
            <MenuItem
              icon={getIcon(GoalsOutline, GoalsSolid, "Metas")}
              text="Metas"
              isActive={activeItem === "Metas"}
              isDark={isDarkMode}
              onClick={() => setActiveItem("Metas")}
              isCollapsed={isCollapsed}
              href="/geral/metas"
            />
          </MenuSection>

          {/* ANÁLISE */}
          <MenuSection
            title="ANÁLISE"
            isDark={isDarkMode}
            isCollapsed={isCollapsed}
            isOpen={openSection === "ANÁLISE"}
            onToggle={() => handleSectionToggle("ANÁLISE")}
          >
            <MenuItem
              icon={getIcon(CompareOutline, CompareSolid, "Comparar")}
              text="Comparar"
              isActive={activeItem === "Comparar"}
              isDark={isDarkMode}
              onClick={() => setActiveItem("Comparar")}
              isCollapsed={isCollapsed}
              href="/analise/comparar"
            />
            <MenuItem
              icon={getIcon(IndicatorsOutline, IndicatorsSolid, "Indicadores")}
              text="Indicadores"
              isActive={activeItem === "Indicadores"}
              isDark={isDarkMode}
              onClick={() => setActiveItem("Indicadores")}
              isCollapsed={isCollapsed}
              href="/analise/indicadores"
            />
            <MenuItem
              icon={getIcon(NewsOutline, NewsSolid, "Notícias")}
              text="Notícias"
              isActive={activeItem === "Notícias"}
              isDark={isDarkMode}
              onClick={() => setActiveItem("Notícias")}
              isCollapsed={isCollapsed}
              href="/analise/noticias"
            />
            <MenuItem
              icon={getIcon(SimulationsOutline, SimulationsSolid, "Simulações")}
              text="Simulações"
              isActive={activeItem === "Simulações"}
              isDark={isDarkMode}
              onClick={() => setActiveItem("Simulações")}
              isCollapsed={isCollapsed}
              href="/analise/simulacoes"
            />
          </MenuSection>
        </div>

        {/* PREFERÊNCIAS */}
        <div
          className={`border-t ${
            isDarkMode ? "border-neutral-700" : "border-gray-200"
          } pt-2`}
        >
          <MenuSection
            title="PREFERÊNCIAS"
            isDark={isDarkMode}
            isCollapsed={isCollapsed}
            alwaysOpen={true}
          >
            <MenuItem
              icon={getIcon(SettingsOutline, SettingsSolid, "Configurações")}
              text="Configurações"
              isActive={activeItem === "Configurações"}
              isDark={isDarkMode}
              onClick={() => setActiveItem("Configurações")}
              isCollapsed={isCollapsed}
              href="/preferencias/configuracoes"
            />
            <DarkModeToggle
              isDark={isDarkMode}
              onToggle={onDarkModeChange}
              isCollapsed={isCollapsed}
            />
            <MenuItem
              icon={getIcon(HelpOutline, HelpSolid, "Ajuda")}
              text="Ajuda"
              isActive={activeItem === "Ajuda"}
              isDark={isDarkMode}
              onClick={() => setActiveItem("Ajuda")}
              isCollapsed={isCollapsed}
              href="/ajuda"
            />
            <UserProfile isDark={isDarkMode} isCollapsed={isCollapsed} />
          </MenuSection>
        </div>
      </div>
    </div>
  );
}
