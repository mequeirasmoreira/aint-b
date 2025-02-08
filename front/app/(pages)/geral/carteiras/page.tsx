/**
 * CarteirasPage - Página principal de gerenciamento de carteiras
 * 
 * Gerencia:
 * - Lista de carteiras
 * - Modal de criação
 * - Atualização automática após criação
 */

"use client";

import { useState, useRef } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import CarteirasGrid from "./components/CarteirasGrid";
import NovaCarteiraModal from "./components/NovaCarteiraModal";
import RootLayout from "../../../components/RootLayout";

export default function CarteirasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const refreshCarteirasRef = useRef<() => void>(() => {});

  // Função para atualizar a lista de carteiras
  const handleRefresh = () => {
    refreshCarteirasRef.current();
  };

  return (
    <RootLayout>
      {({ isDarkMode }) => (
        <div className={`p-6 ${isDarkMode ? "bg-neutral-900" : "bg-slate-100"}`}>
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-2xl font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              Minhas Carteiras
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Nova Carteira
            </button>
          </div>
          
          <CarteirasGrid 
            isDarkMode={isDarkMode} 
            onRefresh={(refresh) => {
              refreshCarteirasRef.current = refresh;
            }}
          />
          
          {isModalOpen && (
            <NovaCarteiraModal
              onClose={() => setIsModalOpen(false)}
              onSuccess={() => {
                setIsModalOpen(false);
                handleRefresh();
              }}
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      )}
    </RootLayout>
  );
}
