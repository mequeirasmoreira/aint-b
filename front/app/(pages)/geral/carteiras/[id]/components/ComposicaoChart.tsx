/**
 * Gráfico de composição da carteira
 * Exibe a distribuição dos ativos em formato de pizza
 */

"use client";

interface Asset {
  id: number;
  symbol: string;
  percentage: number;
}

interface ComposicaoChartProps {
  assets: Asset[];
  isDarkMode?: boolean;
}

export default function ComposicaoChart({ assets, isDarkMode }: ComposicaoChartProps) {
  // TODO: Implementar gráfico de pizza usando uma biblioteca como Chart.js ou D3
  return (
    <div className="h-64 flex items-center justify-center">
      <p className={`text-sm ${
        isDarkMode ? "text-gray-400" : "text-gray-600"
      }`}>
        Gráfico de composição será implementado aqui
      </p>
    </div>
  );
}
