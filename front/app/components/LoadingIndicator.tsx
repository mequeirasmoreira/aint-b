/**
 * LoadingIndicator - Componente reutilizável para estados de carregamento
 * 
 * Este componente fornece um indicador visual de carregamento com suporte a:
 * - Mensagens contextuais
 * - Contagem de tentativas
 * - Tema claro/escuro
 * 
 * @example
 * // Uso básico
 * <LoadingIndicator message="Carregando..." />
 * 
 * // Com retry
 * <LoadingIndicator 
 *   message="Tentando reconectar..." 
 *   isDarkMode={true}
 *   retryCount={2}
 *   maxRetries={3}
 * />
 */

"use client";

interface LoadingIndicatorProps {
  /** Mensagem a ser exibida durante o carregamento */
  message: string;
  /** Define se o tema escuro está ativo */
  isDarkMode?: boolean;
  /** Número da tentativa atual (opcional) */
  retryCount?: number;
  /** Número máximo de tentativas (opcional) */
  maxRetries?: number;
}

export function LoadingIndicator({ 
  message, 
  isDarkMode,
  retryCount,
  maxRetries 
}: LoadingIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Spinner animado */}
      <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
        isDarkMode ? "border-emerald-500" : "border-emerald-600"
      }`} />
      
      <div className="text-center">
        {/* Mensagem principal */}
        <p className={`text-lg font-medium ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}>
          {message}
        </p>
        
        {/* Contador de tentativas (opcional) */}
        {retryCount !== undefined && maxRetries !== undefined && (
          <p className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            Tentativa {retryCount} de {maxRetries}
          </p>
        )}
      </div>
    </div>
  );
}