"use client";

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { debounce } from 'lodash';

interface Stock {
  symbol: string;
  name: string;
  sector?: string;
  subsector?: string;
}

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (asset: {
    symbol: string;
    quantity: string;
    purchase_price: string;
    purchase_date: string;
    notes?: string;
  }) => void;
}

export default function AddAssetModal({ isOpen, onClose, onAdd }: AddAssetModalProps) {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [notes, setNotes] = useState('');
  const [suggestions, setSuggestions] = useState<Stock[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Função para buscar sugestões de ativos
  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/stocks/suggest/${query}`);
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
    }
  };

  // Debounce para evitar muitas requisições
  const debouncedFetch = debounce(fetchSuggestions, 300);

  // Atualiza sugestões quando o usuário digita
  useEffect(() => {
    debouncedFetch(symbol);
    return () => {
      debouncedFetch.cancel();
    };
  }, [symbol]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      symbol,
      quantity,
      purchase_price: purchasePrice,
      purchase_date: purchaseDate,
      notes
    });
    onClose();
  };

  const handleSelectSuggestion = (stock: Stock) => {
    setSymbol(stock.symbol);
    setShowSuggestions(false);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Fechar</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Adicionar Ativo
                    </Dialog.Title>
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                      <div className="relative">
                        <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
                          Símbolo
                        </label>
                        <input
                          type="text"
                          name="symbol"
                          id="symbol"
                          value={symbol}
                          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                          required
                        />
                        {showSuggestions && suggestions.length > 0 && (
                          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
                            <ul className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                              {suggestions.map((stock) => (
                                <li
                                  key={stock.symbol}
                                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-emerald-50"
                                  onClick={() => handleSelectSuggestion(stock)}
                                >
                                  <div className="flex items-center">
                                    <span className="font-medium block truncate">
                                      {stock.symbol}
                                    </span>
                                    <span className="text-gray-500 ml-2">
                                      {stock.name}
                                    </span>
                                  </div>
                                  {stock.sector && (
                                    <p className="text-sm text-gray-500">
                                      {stock.sector} - {stock.subsector}
                                    </p>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                          Quantidade
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="quantity"
                          id="quantity"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="purchase-price" className="block text-sm font-medium text-gray-700">
                          Preço de Compra
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="purchase-price"
                          id="purchase-price"
                          value={purchasePrice}
                          onChange={(e) => setPurchasePrice(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="purchase-date" className="block text-sm font-medium text-gray-700">
                          Data da Compra
                        </label>
                        <input
                          type="date"
                          name="purchase-date"
                          id="purchase-date"
                          value={purchaseDate}
                          onChange={(e) => setPurchaseDate(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                          Observações
                        </label>
                        <textarea
                          name="notes"
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                        />
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 sm:ml-3 sm:w-auto"
                        >
                          Adicionar
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={onClose}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
