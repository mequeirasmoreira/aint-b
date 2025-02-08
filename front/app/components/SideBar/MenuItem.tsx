"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItemProps {
  icon: React.ReactNode;
  text: string;
  hasSubmenu?: boolean;
  amount?: string;
  isActive?: boolean;
  isDark?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
  href?: string;
}

export function MenuItem({
  icon,
  text,
  hasSubmenu,
  amount,
  isActive = false,
  isDark = false,
  isCollapsed = false,
  onClick,
  href,
}: MenuItemProps) {
  const pathname = usePathname();
  
  // Verifica se o item está ativo baseado na rota atual
  const isActiveRoute = href ? (
    pathname === href || // Rota exata
    (pathname.startsWith(href) && href !== "/") // Sub-rota (exceto para a raiz)
  ) : isActive;

  const content = (
    <div
      className={twMerge(
        "group flex items-center cursor-pointer transition-all duration-200 rounded-lg",
        isCollapsed ? "justify-center p-2 mx-1 mb-1" : "pl-4 py-2 mx-2",
        isActiveRoute
          ? isDark
            ? "bg-white/10 text-white"
            : "bg-white text-slate-900 shadow-sm"
          : isDark
          ? "text-slate-200 hover:bg-white/10"
          : "text-slate-600 hover:bg-white"
      )}
    >
      <div className={`flex items-center ${isCollapsed ? "justify-center w-8 h-8" : "flex-1"}`}>
        <span
          className={twMerge(
            "transition-colors",
            !isCollapsed && "mr-3",
            isActiveRoute
              ? isDark
                ? "text-white"
                : "text-slate-900"
              : isDark
              ? "text-slate-200 group-hover:text-white"
              : "text-gray-600 group-hover:text-slate-700"
          )}
        >
          {icon}
        </span>
        {!isCollapsed && (
          <span
            className={twMerge(
              "transition-colors text-sm",
              isActiveRoute
                ? isDark
                  ? "text-white"
                  : "text-slate-900"
                : isDark
                ? "text-slate-200 group-hover:text-white"
                : "text-slate-600 group-hover:text-slate-700"
            )}
          >
            {text}
          </span>
        )}
      </div>
      {!isCollapsed && hasSubmenu && (
        <ChevronDownIcon className={`w-4 h-4 transition-colors mr-4 ${
          isActiveRoute
            ? isDark
              ? "text-white"
              : "text-slate-900"
            : isDark
            ? "text-slate-200 group-hover:text-white"
            : "text-gray-600 group-hover:text-slate-700"
        }`} />
      )}
      {!isCollapsed && amount && (
        <span
          className={`text-sm mr-4 ${
            isActiveRoute
              ? "text-slate-900"
              : "text-slate-500"
          }`}
        >
          {amount}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="block">
        {content}
      </Link>
    );
  }

  return <div onClick={onClick}>{content}</div>;
}
