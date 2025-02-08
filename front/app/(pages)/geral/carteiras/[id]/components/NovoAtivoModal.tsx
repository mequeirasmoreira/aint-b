/**
 * Modal para adicionar novo ativo à carteira
 */

"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface NovoAtivoModalProps {
  carteiraId: string;
  onClose: () => void;
  onSuccess: () => void;
  isDarkMode?: boolean;
}

export default function NovoAtivoModal({ 
  carteiraId,
  onClose, 
  onSuccess,
  isDarkMode 
}: NovoAtivoModalProps) {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8000/api/v1/portfolios/assets/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: symbol.toUpperCase(),
          quantity: quantity,
          purchase_price: price,
          purchase_date: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
          notes: notes || "",
          portfolio_id: Number(carteiraId)
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao adicionar ativo");
      }

      onSuccess();
    } catch (err) {
      setError("Erro ao adicionar ativo. Por favor, tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative w-full max-w-md rounded-lg shadow-lg ${
          isDarkMode ? "bg-neutral-800" : "bg-white"
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className={`text-lg font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              Novo Ativo
            </h3>
            <button
              onClick={onClose}
              className={`rounded-md p-1 hover:bg-gray-100 ${
                isDarkMode ? "hover:bg-neutral-700 text-gray-400" : "text-gray-500"
              }`}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label
                htmlFor="symbol"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Símbolo
              </label>
              <input
                type="text"
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className={`mt-1 block w-full rounded-md px-3 py-2 border ${
                  isDarkMode 
                    ? "bg-neutral-700 border-neutral-600 text-white" 
                    : "border-gray-300 text-gray-900"
                }`}
                required
                placeholder="PETR4"
              />
            </div>

            <div>
              <label
                htmlFor="quantity"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Quantidade
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={`mt-1 block w-full rounded-md px-3 py-2 border ${
                  isDarkMode 
                    ? "bg-neutral-700 border-neutral-600 text-white" 
                    : "border-gray-300 text-gray-900"
                }`}
                required
                min="0"
                step="1"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Preço de Compra
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`mt-1 block w-full rounded-md px-3 py-2 border ${
                  isDarkMode 
                    ? "bg-neutral-700 border-neutral-600 text-white" 
                    : "border-gray-300 text-gray-900"
                }`}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Observações
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className={`mt-1 block w-full rounded-md px-3 py-2 border ${
                  isDarkMode 
                    ? "bg-neutral-700 border-neutral-600 text-white" 
                    : "border-gray-300 text-gray-900"
                }`}
                placeholder="Opcional"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-md ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-neutral-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-md text-white ${
                  loading
                    ? "bg-emerald-500 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {loading ? "Adicionando..." : "Adicionar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
