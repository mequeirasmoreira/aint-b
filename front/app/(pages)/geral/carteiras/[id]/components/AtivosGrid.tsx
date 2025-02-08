/**
 * Grid de ativos da carteira
 * Lista todos os ativos com suas informações principais
 */

"use client";

import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from 'react';

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

interface AtivosGridProps {
  assets: Asset[];
  isDarkMode?: boolean;
  onRefresh: () => void;
}

export default function AtivosGrid({ assets, isDarkMode, onRefresh }: AtivosGridProps) {
  const [currentPrices, setCurrentPrices] = useState<{[key: string]: number}>({});

  useEffect(() => {
    const fetchCurrentPrices = async () => {
      if (!assets || assets.length === 0) return;
      
      console.log("Buscando preços para os ativos:", assets);
      
      try {
        const pricePromises = assets.map(asset => 
          fetch(`http://localhost:8000/api/v1/stocks/${asset.symbol}/realtime`)
            .then(response => response.json())
            .then(data => ({ symbol: asset.symbol, price: data.price }))
        );
        
        const prices = await Promise.all(pricePromises);
        const priceMap = prices.reduce((acc: {[key: string]: number}, item) => {
          acc[item.symbol] = item.price;
          return acc;
        }, {});
        
        console.log("Preços atualizados:", priceMap);
        setCurrentPrices(priceMap);
      } catch (error) {
        console.error('Erro ao buscar preços:', error);
      }
    };

    fetchCurrentPrices();
  }, [assets]);

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || isNaN(value)) return "R$ --";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number | undefined) => {
    if (value === undefined || isNaN(value)) return "--";
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  const formatQuantity = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  if (assets.length === 0) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className={`text-sm ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}>
          Nenhum ativo encontrado
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className={`px-6 py-3 text-left text-xs font-medium ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            } uppercase tracking-wider`}>
              Ativo
            </th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            } uppercase tracking-wider`}>
              Quantidade
            </th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            } uppercase tracking-wider`}>
              Preço de Compra
            </th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            } uppercase tracking-wider`}>
              Preço Atual
            </th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            } uppercase tracking-wider`}>
              Total
            </th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            } uppercase tracking-wider`}>
              %
            </th>
            <th className={`px-6 py-3 text-right text-xs font-medium ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            } uppercase tracking-wider`}>
              Ações
            </th>
          </tr>
        </thead>
        <tbody className={`divide-y ${
          isDarkMode ? "divide-neutral-700" : "divide-gray-200"
        }`}>
          {assets.map((asset) => {
            // Converte os valores para número
            const quantity = parseFloat(asset.quantity);
            const purchasePrice = parseFloat(asset.purchase_price);
            const currentPrice = currentPrices[asset.symbol];
            
            // Calcula o valor total usando o preço atual se disponível
            const total = currentPrice ? quantity * currentPrice : quantity * purchasePrice;

            // Calcula o valor total da carteira
            const portfolioTotal = assets.reduce((acc, currentAsset) => {
              const assetQuantity = parseFloat(currentAsset.quantity);
              const assetCurrentPrice = currentPrices[currentAsset.symbol];
              const assetPurchasePrice = parseFloat(currentAsset.purchase_price);
              const assetTotal = assetCurrentPrice ? assetQuantity * assetCurrentPrice : assetQuantity * assetPurchasePrice;
              return acc + assetTotal;
            }, 0);

            // Calcula o percentual de representatividade
            const percentage = (total / portfolioTotal) * 100;

            return (
              <tr key={asset.id}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>
                  {asset.symbol}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-500"
                }`}>
                  {formatQuantity(quantity)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-500"
                }`}>
                  {formatCurrency(purchasePrice)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-500"
                }`}>
                  {formatCurrency(currentPrice)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-500"
                }`}>
                  {formatCurrency(total)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-500"
                }`}>
                  {formatPercentage(percentage)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => {/* TODO: Implementar edição */}}
                    className={`text-emerald-600 hover:text-emerald-700 ${
                      isDarkMode ? "hover:text-emerald-500" : ""
                    }`}
                    title="Editar ativo"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {/* TODO: Implementar remoção */}}
                    className={`text-red-600 hover:text-red-700 ${
                      isDarkMode ? "hover:text-red-500" : ""
                    }`}
                    title="Remover ativo"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
