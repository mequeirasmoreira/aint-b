/**
 * CarteirasGrid - Componente de grid para exibição de carteiras
 * 
 * Este componente gerencia:
 * 1. Listagem de carteiras
 * 2. Estados de loading
 * 3. Tratamento de erros
 * 4. Sistema de retry automático
 * 5. Atualização de preços em tempo real
 * 
 * Funcionalidades:
 * - Retry automático em caso de falha na API
 * - Loading state informativo com contador de tentativas
 * - Tratamento de erro amigável com botão de retry
 * - Suporte a tema claro/escuro
 * - Suporte a refresh externo
 * - Atualização automática de preços
 * 
 * @example
 * <CarteirasGrid isDarkMode={true} onRefresh={() => console.log("Refreshed!")} />
 */

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import CarteiraCard from "./CarteiraCard";
import { LoadingIndicator } from "../../../../components/LoadingIndicator";

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

interface Carteira {
  id: number;
  name: string;
  description: string;
  created_at: string;
  assets: Asset[];
}

interface CarteirasGridProps {
  isDarkMode?: boolean;
  onRefresh?: (refreshFn: () => void) => void;
}

// Configurações do sistema de retry
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 segundos

export default function CarteirasGrid({ isDarkMode, onRefresh }: CarteirasGridProps) {
  // Estados
  const [carteiras, setCarteiras] = useState<Carteira[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  // Refs para controle de intervalos e montagem
  const updateInterval = useRef<NodeJS.Timeout>();
  const isMounted = useRef(true);

  /**
   * Função para buscar preços em tempo real para uma carteira
   * @param carteira - Carteira para atualizar os preços
   */
  const fetchRealtimePrices = async (carteira: Carteira) => {
    try {
      // Busca os preços em paralelo
      const pricePromises = carteira.assets.map(async (asset) => {
        const response = await fetch(`/api/v1/stocks/${asset.symbol}/realtime`);
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
      const updatedAssets = carteira.assets.map(asset => {
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

      return {
        ...carteira,
        assets: assetsWithPercentage
      };
    } catch (err) {
      console.error("Erro ao buscar preços em tempo real:", err);
      return carteira;
    }
  };

  /**
   * Função para atualizar os preços de todas as carteiras
   */
  const updateAllPrices = useCallback(async () => {
    if (!isMounted.current || carteiras.length === 0) return;

    try {
      const updatedCarteiras = await Promise.all(
        carteiras.map(async (carteira) => {
          if (carteira.assets && carteira.assets.length > 0) {
            return await fetchRealtimePrices(carteira);
          }
          return carteira;
        })
      );

      if (isMounted.current) {
        setCarteiras(updatedCarteiras);
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error("Erro ao atualizar preços:", err);
    }
  }, [carteiras]);

  /**
   * Função para buscar carteiras da API
   */
  const fetchCarteiras = useCallback(async (retry = 0) => {
    try {
      // Primeiro busca a lista de carteiras
      const response = await fetch("/api/v1/portfolios/");
      if (!response.ok) {
        throw new Error("Falha ao carregar carteiras");
      }
      const carteirasBasicas = await response.json();

      if (!isMounted.current) return;

      // Depois busca os detalhes de cada carteira
      const carteirasCompletas = await Promise.all(
        carteirasBasicas.map(async (carteira: Carteira) => {
          const detailResponse = await fetch(`/api/v1/portfolios/${carteira.id}`);
          if (!detailResponse.ok) {
            console.error(`Erro ao buscar detalhes da carteira ${carteira.id}`);
            return carteira;
          }
          return await detailResponse.json();
        })
      );

      if (!isMounted.current) return;

      // Atualiza as carteiras primeiro
      setCarteiras(carteirasCompletas);
      setLoading(false);
      setError("");
      setRetryCount(0);

      // Depois busca os preços em tempo real
      if (carteirasCompletas.length > 0) {
        const updatedCarteiras = await Promise.all(
          carteirasCompletas.map(async (carteira: Carteira) => {
            if (carteira.assets && carteira.assets.length > 0) {
              return await fetchRealtimePrices(carteira);
            }
            return carteira;
          })
        );

        if (isMounted.current) {
          setCarteiras(updatedCarteiras);
          setLastUpdate(new Date());
        }
      }
    } catch (err) {
      console.error("Erro ao carregar carteiras:", err);
      
      // Sistema de retry
      if (retry < MAX_RETRIES) {
        setRetryCount(retry + 1);
        setTimeout(() => {
          if (isMounted.current) {
            fetchCarteiras(retry + 1);
          }
        }, RETRY_DELAY);
      } else {
        if (isMounted.current) {
          setError("Não foi possível carregar as carteiras. Por favor, tente novamente mais tarde.");
          setLoading(false);
        }
      }
    }
  }, []); 

  // Registra a função de refresh quando o componente monta
  useEffect(() => {
    if (onRefresh) {
      const refreshFn = () => {
        setLoading(true);
        fetchCarteiras();
      };
      onRefresh(refreshFn);
    }
  }, [onRefresh]); // Removida dependência de fetchCarteiras

  // Carrega as carteiras ao montar o componente e configura o intervalo
  useEffect(() => {
    isMounted.current = true;
    fetchCarteiras();

    // Configura o intervalo de atualização para 5 minutos (300000ms)
    updateInterval.current = setInterval(updateAllPrices, 300000);

    // Cleanup
    return () => {
      isMounted.current = false;
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
    };
  }, [fetchCarteiras]);

  // Estado de loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingIndicator
          message={retryCount > 0 ? "Tentando reconectar..." : "Carregando carteiras..."}
          isDarkMode={isDarkMode}
          retryCount={retryCount}
          maxRetries={MAX_RETRIES}
        />
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <p className={`text-lg text-center ${
          isDarkMode ? "text-red-400" : "text-red-600"
        }`}>{error}</p>
        <button
          onClick={() => {
            setLoading(true);
            setRetryCount(0);
            fetchCarteiras();
          }}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            isDarkMode 
              ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
              : "bg-emerald-500 hover:bg-emerald-600 text-white"
          }`}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  // Estado vazio
  if (carteiras.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <p className={`text-lg ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}>Nenhuma carteira encontrada</p>
        <p className={`text-sm ${
          isDarkMode ? "text-gray-500" : "text-gray-500"
        }`}>Clique em "Nova Carteira" para começar</p>
      </div>
    );
  }

  // Renderiza o grid de carteiras
  return (
    <div>
      {/* Header com última atualização e botão de refresh */}
      <div className="flex justify-between items-center mb-4">
        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          {lastUpdate 
            ? `Última atualização: ${lastUpdate.toLocaleTimeString("pt-BR")}`
            : "Atualizando preços..."}
        </p>
        <button
          onClick={updateAllPrices}
          className={`text-sm ${
            isDarkMode ? "text-emerald-400" : "text-emerald-600"
          } hover:underline`}
        >
          Atualizar Preços
        </button>
      </div>

      {/* Grid de carteiras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {carteiras.map((carteira) => (
          <CarteiraCard 
            key={carteira.id} 
            carteira={carteira} 
            isDarkMode={isDarkMode} 
          />
        ))}
      </div>
    </div>
  );
}
