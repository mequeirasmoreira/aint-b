/**
 * NovaCarteiraModal - Modal para criação de novas carteiras
 * 
 * Features:
 * - Formulário de criação
 * - Validação de campos
 * - Feedback visual de loading
 * - Tratamento de erros
 * - Suporte a tema escuro
 * - Callback de sucesso para atualização da lista
 */

"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface NovaCarteiraModalProps {
  onClose: () => void;
  onSuccess: () => void;
  isDarkMode?: boolean;
}

export default function NovaCarteiraModal({ 
  onClose, 
  onSuccess,
  isDarkMode 
}: NovaCarteiraModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/v1/portfolios/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao criar carteira");
      }

      // Limpa o formulário
      setName("");
      setDescription("");
      
      // Notifica sucesso e fecha o modal
      onSuccess();
      onClose();
    } catch (err) {
      setError("Erro ao criar carteira. Por favor, tente novamente.");
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
              Nova Carteira
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
                htmlFor="name"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Nome
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mt-1 block w-full rounded-md px-3 py-2 border ${
                  isDarkMode 
                    ? "bg-neutral-700 border-neutral-600 text-white" 
                    : "border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Descrição
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`mt-1 block w-full rounded-md px-3 py-2 border ${
                  isDarkMode 
                    ? "bg-neutral-700 border-neutral-600 text-white" 
                    : "border-gray-300 text-gray-900"
                }`}
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
                {loading ? "Criando..." : "Criar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
