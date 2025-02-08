/**
 * Card de carteira
 * Exibe informações básicas e permite navegação para detalhes
 */

"use client";

import { ChartBarIcon, WalletIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

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

interface CarteiraCardProps {
  carteira: Carteira;
  isDarkMode?: boolean;
}

export default function CarteiraCard({ carteira, isDarkMode }: CarteiraCardProps) {
  const router = useRouter();
  const createdAt = new Date(carteira.created_at).toLocaleDateString("pt-BR");
  const totalAtivos = carteira.assets?.length ?? 0;
  
  // Calcula o valor total da carteira
  const valorTotal = carteira.assets?.reduce((acc, asset) => {
    const quantity = parseFloat(asset.quantity);
    
    // Se o ativo já tem total_value calculado, usa ele
    if (asset.total_value !== undefined) {
      return acc + asset.total_value;
    }
    
    // Se tem current_price, calcula com ele
    if (asset.current_price !== undefined) {
      return acc + (quantity * asset.current_price);
    }
    
    // Senão usa o purchase_price
    return acc + (quantity * parseFloat(asset.purchase_price));
  }, 0) ?? 0;

  // Calcula o valor total de compra (para comparação)
  const valorTotalCompra = carteira.assets?.reduce((acc, asset) => {
    const quantity = parseFloat(asset.quantity);
    const purchasePrice = parseFloat(asset.purchase_price);
    return acc + (quantity * purchasePrice);
  }, 0) ?? 0;

  // Calcula a variação percentual
  const variacao = valorTotalCompra > 0 
    ? ((valorTotal - valorTotalCompra) / valorTotalCompra) * 100 
    : 0;

  return (
    <div className={`rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 ${
      isDarkMode ? "bg-neutral-800" : "bg-white"
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
            {carteira.name}
          </h3>
          <p className={`text-sm mt-1 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            {carteira.description || "Sem descrição"}
          </p>
        </div>
        <WalletIcon className="w-6 h-6 text-emerald-600" />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex items-center space-x-2">
          <WalletIcon className={`h-5 w-5 text-gray-400`} />
          <div>
            <p className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}>Total de Ativos</p>
            <p className={`text-lg font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>{totalAtivos}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <ChartBarIcon className={`h-5 w-5 text-gray-400`} />
          <div>
            <p className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}>Valor Total</p>
            <div>
              <p className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(valorTotal)}
              </p>
              {variacao !== 0 && (
                <p className={`text-sm ${
                  variacao > 0 
                    ? "text-green-500" 
                    : variacao < 0 
                      ? "text-red-500" 
                      : isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  {variacao > 0 ? "+" : ""}{variacao.toFixed(2)}%
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => router.push(`/geral/carteiras/${carteira.id}`)}
          className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          <ChartBarIcon className="w-4 h-4 mr-1" />
          Ver Detalhes
        </button>
      </div>
    </div>
  );
}
