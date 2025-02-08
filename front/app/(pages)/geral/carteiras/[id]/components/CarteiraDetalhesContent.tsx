/**
 * Conteúdo da página de detalhes da carteira
 * Gerencia o estado e as chamadas à API
 */

"use client";

import { useEffect, useState } from "react";
import { PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { LoadingIndicator } from "../../../../../components/LoadingIndicator";
import AtivosGrid from "./AtivosGrid";
import ComposicaoChart from "./ComposicaoChart";
import NovoAtivoModal from "./NovoAtivoModal";

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
  quantity: string;
  purchase_price: string;
  current_price?: number;
  total_value?: number;
  percentage?: number;
  notes?: string;
  purchase_date: string;
}

interface CarteiraDetalhesContentProps {
  id: string;
  isDarkMode?: boolean;
}

export default function CarteiraDetalhesContent({ id, isDarkMode }: CarteiraDetalhesContentProps) {
  const router = useRouter();
  const [carteira, setCarteira] = useState<Carteira | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Busca os preços em tempo real dos ativos
  const fetchRealtimePrices = async (assets: Asset[]) => {
    try {
      // Busca os preços em paralelo
      const pricePromises = assets.map(async (asset) => {
        const response = await fetch(`http://localhost:8000/api/v1/stocks/${asset.symbol}/realtime`);
        if (!response.ok) {
          console.error(`Erro ao buscar preço para ${asset.symbol}`);
          return null;
        }
        return {
          symbol: asset.symbol,
          data: await response.json()
        };
      });

      // Aguarda todas as requisições terminarem
      const prices = await Promise.all(pricePromises);

      // Atualiza os ativos com os preços em tempo real
      const updatedAssets = assets.map(asset => {
        const priceData = prices.find(p => p?.symbol === asset.symbol)?.data;
        if (!priceData) return asset;

        const current_price = priceData.price;
        const quantity = parseFloat(asset.quantity);
        const total_value = current_price * quantity;
        
        return {
          ...asset,
          current_price,
          total_value
        };
      });

      // Calcula as porcentagens
      const totalValue = updatedAssets.reduce((sum, asset) => sum + (asset.total_value || 0), 0);
      const assetsWithPercentage = updatedAssets.map(asset => ({
        ...asset,
        percentage: totalValue > 0 ? ((asset.total_value || 0) / totalValue) * 100 : 0
      }));

      // Atualiza a carteira com os novos dados
      setCarteira(prev => prev ? {
        ...prev,
        assets: assetsWithPercentage
      } : null);

    } catch (err) {
      console.error("Erro ao buscar preços em tempo real:", err);
    }
  };

  const fetchCarteira = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/portfolios/${id}`);
      if (!response.ok) {
        throw new Error("Falha ao carregar carteira");
      }
      const data = await response.json();
      setCarteira(data);
      setError("");

      // Busca os preços em tempo real após carregar a carteira
      if (data.assets && data.assets.length > 0) {
        fetchRealtimePrices(data.assets);
      }
    } catch (err) {
      setError("Erro ao carregar carteira");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarteira();

    // Atualiza os preços a cada 5 minutos
    const interval = setInterval(() => {
      if (carteira?.assets && carteira.assets.length > 0) {
        fetchRealtimePrices(carteira.assets);
      }
    }, 300000); // 5 minutos

    return () => clearInterval(interval);
  }, [id]);

  return (
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
          carteiraId={id}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchCarteira();
          }}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}
