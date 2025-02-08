/**
 * Página de detalhes da carteira
 * Exibe informações detalhadas e permite gerenciar ativos
 */

"use client";

import { useEffect, useState } from "react";
import { PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import RootLayout from "../../../../components/RootLayout";
import { LoadingIndicator } from "../../../../components/LoadingIndicator";
import AtivosGrid from "./components/AtivosGrid";
import ComposicaoChart from "./components/ComposicaoChart";
import NovoAtivoModal from "./components/NovoAtivoModal";

interface Carteira {
  id: number;
  name: string;
  description: string;
  created_at: string;
  assets: Asset[];
}

interface Asset {
  id: number;
  symbol: string;
  quantity: number;
  average_price: number;
  current_price: number;
  total_value: number;
  percentage: number;
}

export default function CarteiraDetalhesPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [carteira, setCarteira] = useState<Carteira | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCarteira();
  }, [params.id]);

  const fetchCarteira = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/portfolios/${params.id}`);
      if (!response.ok) {
        throw new Error("Falha ao carregar carteira");
      }
      const data = await response.json();
      setCarteira(data);
      setError("");
    } catch (err) {
      setError("Erro ao carregar carteira");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RootLayout>
      {({ isDarkMode }) => (
        <div className={`p-6 ${isDarkMode ? "bg-neutral-900" : "bg-slate-100"}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className={`p-2 rounded-md hover:bg-opacity-80 ${
                  isDarkMode ? "hover:bg-neutral-800" : "hover:bg-gray-200"
                }`}
              >
                <ArrowLeftIcon className={`w-5 h-5 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`} />
              </button>
              <h1 className={`text-2xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                {loading ? "Carregando..." : carteira?.name}
              </h1>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Novo Ativo
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingIndicator
                message="Carregando carteira..."
                isDarkMode={isDarkMode}
              />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className={`text-lg ${
                isDarkMode ? "text-red-400" : "text-red-600"
              }`}>
                {error}
              </p>
            </div>
          ) : carteira ? (
            <div className="space-y-6">
              {/* Descrição */}
              <p className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                {carteira.description}
              </p>

              {/* Grid de informações */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gráfico de composição */}
                <div className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-neutral-800" : "bg-white"
                }`}>
                  <h2 className={`text-lg font-medium mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}>
                    Composição da Carteira
                  </h2>
                  <ComposicaoChart assets={carteira.assets} isDarkMode={isDarkMode} />
                </div>

                {/* Resumo */}
                <div className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-neutral-800" : "bg-white"
                }`}>
                  <h2 className={`text-lg font-medium mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}>
                    Resumo
                  </h2>
                  {/* TODO: Implementar resumo com valor total, retorno, etc */}
                </div>
              </div>

              {/* Lista de ativos */}
              <div className={`p-4 rounded-lg ${
                isDarkMode ? "bg-neutral-800" : "bg-white"
              }`}>
                <h2 className={`text-lg font-medium mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>
                  Ativos
                </h2>
                <AtivosGrid 
                  assets={carteira.assets} 
                  isDarkMode={isDarkMode}
                  onRefresh={fetchCarteira}
                />
              </div>
            </div>
          ) : null}

          {/* Modal de novo ativo */}
          {isModalOpen && (
            <NovoAtivoModal
              carteiraId={params.id}
              onClose={() => setIsModalOpen(false)}
              onSuccess={() => {
                setIsModalOpen(false);
                fetchCarteira();
              }}
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      )}
    </RootLayout>
  );
}
