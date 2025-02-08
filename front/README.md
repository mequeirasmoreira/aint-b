# Aint-B Frontend

Sistema de gerenciamento de investimentos construído com Next.js 14, TypeScript e Tailwind CSS.

> 💡 **Para Desenvolvedores Júnior**: Este é um guia passo a passo para você entender e contribuir com o projeto. Se tiver dúvidas, não hesite em perguntar!

## Estrutura do Projeto

```
front/
├── app/                    # Diretório principal do Next.js 14
│   ├── (pages)/           # Páginas da aplicação
│   │   ├── analise/       # Módulo de análise de investimentos
│   │   │   ├── page.tsx   # Página principal de análise
│   │   │   └── layout.tsx # Layout específico da análise
│   │   └── geral/         # Módulo de visão geral
│   │       ├── page.tsx   # Página principal geral
│   │       └── layout.tsx # Layout específico geral
│   ├── components/        # Componentes reutilizáveis
│   │   ├── LoadingIndicator/  # Componente de loading
│   │   └── CarteirasGrid/     # Grid de carteiras
│   ├── contexts/          # Contextos React (estados globais)
│   │   └── ThemeContext.tsx   # Gerenciamento de tema
│   ├── providers/         # Providers da aplicação
│   │   └── AppProvider.tsx    # Provider principal
│   └── hooks/            # Hooks customizados
        └── useTheme.ts   # Hook para gerenciar tema
```

## Guia para Iniciantes

### 1. Primeiros Passos

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/aint-b.git
cd aint-b/front
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o ambiente:
   - Copie o arquivo `.env.example` para `.env.local`
   - Preencha as variáveis necessárias

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

### 2. Entendendo o Código

#### Exemplo de Página (pages/analise/page.tsx)
```typescript
// app/(pages)/analise/page.tsx
'use client';

import { useTheme } from '@/hooks/useTheme';
import { CarteirasGrid } from '@/components/CarteirasGrid';

export default function AnalisePage() {
  const { isDarkMode } = useTheme();  // Hook para tema

  return (
    <div className={isDarkMode ? 'dark' : 'light'}>
      <h1>Análise de Carteiras</h1>
      <CarteirasGrid />
    </div>
  );
}
```

#### Exemplo de Componente (components/LoadingIndicator/index.tsx)
```typescript
// app/components/LoadingIndicator/index.tsx
import { useEffect } from 'react';
import logger from '@/utils/logger';

interface LoadingIndicatorProps {
  message: string;
  retryCount?: number;
}

export function LoadingIndicator({ message, retryCount = 0 }: LoadingIndicatorProps) {
  useEffect(() => {
    // Exemplo de logging para debug
    logger.debug(`[LoadingIndicator] - mount - message: ${message}, retryCount: ${retryCount}`);
  }, [message, retryCount]);

  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      <p className="ml-2">{message}</p>
      {retryCount > 0 && <p className="text-sm">Tentativa {retryCount}/3</p>}
    </div>
  );
}
```

### 3. Como Usar os Componentes

#### CarteirasGrid
Este componente exibe uma grade de carteiras de investimento:

```typescript
// Seu arquivo de página
import { CarteirasGrid } from '@/components/CarteirasGrid';

export default function SuaPagina() {
  return (
    <div>
      <h1>Minhas Carteiras</h1>
      {/* O componente já possui tratamento de erro e loading interno */}
      <CarteirasGrid />
    </div>
  );
}
```

#### LoadingIndicator
Usar este componente para mostrar estados de carregamento:

```typescript
import { LoadingIndicator } from '@/components/LoadingIndicator';

export default function SuaPagina() {
  return (
    <div>
      <LoadingIndicator 
        message="Carregando carteiras..." 
        retryCount={1}  // Opcional: mostra quantas tentativas foram feitas
      />
    </div>
  );
}
```

### 4. Hooks Personalizados

#### useTheme
Hook para gerenciar o tema da aplicação:

```typescript
import { useTheme } from '@/hooks/useTheme';

function SeuComponente() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {isDarkMode ? '🌞 Modo Claro' : '🌙 Modo Escuro'}
    </button>
  );
}
```

## Dicas para Desenvolvimento

### 1. Logging
Sempre usar o logger para debug:
```typescript
import logger from '@/utils/logger';

function SeuComponente() {
  logger.debug('[SeuComponente] - método - parâmetros:', { param1, param2 });
}
```

### 2. Tratamento de Erros
Sempre envolver chamadas à API em try/catch:
```typescript
try {
  const data = await fetchCarteiras();
  // Processa os dados
} catch (error) {
  logger.error('[SeuComponente] - Erro ao buscar carteiras:', error);
  // Mostra mensagem amigável ao usuário
}
```

### 3. Performance
Evitar re-renders desnecessários:
```typescript
// Ruim ❌
const handleClick = () => {
  console.log('clicou');
};

// Bom ✅
const handleClick = useCallback(() => {
  console.log('clicou');
}, []);
```

## Principais Funcionalidades

### 1. Sistema de Temas
- Suporte a tema claro/escuro
- Implementado via Context API
- Persistência via localStorage
- Componentes adaptáveis aos temas

### 2. Layout e Navegação
- Layout responsivo com sidebar colapsável
- Sistema de rotas baseado em App Router do Next.js 14
- Navegação dinâmica entre módulos

### 3. Gerenciamento de Carteiras
- Listagem de carteiras com sistema de retry
- Loading states informativos
- Tratamento de erros amigável
- Sistema de reconexão automática

### 4. Componentes Principais

#### LoadingIndicator
```typescript
interface LoadingIndicatorProps {
  message: string;
  isDarkMode?: boolean;
  retryCount?: number;
  maxRetries?: number;
}
```
Componente reutilizável para estados de loading com:
- Mensagens contextuais
- Contador de tentativas
- Suporte a tema escuro/claro

#### CarteirasGrid
Sistema de exibição de carteiras com:
- Retry automático (3 tentativas)
- Delay entre tentativas (2 segundos)
- Estados de loading e erro
- Mensagens informativas

## Tecnologias Utilizadas

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Context API
- React Hooks

### Principais Dependências
- @heroicons/react: Ícones
- next/navigation: Roteamento
- next/font: Otimização de fontes

## Padrões de Código

### 1. Gerenciamento de Estado
- Context API para estados globais
- useState para estados locais
- useCallback para otimização de performance

### 2. Tratamento de Erros
```typescript
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error();
  // Processamento normal
} catch (err) {
  // Sistema de retry
  if (retry < MAX_RETRIES) {
    // Tenta novamente
  } else {
    // Mostra erro amigável
  }
}
```

### 3. Componentes
- Componentes funcionais com TypeScript
- Props tipadas com interfaces
- Suporte a temas via props
- Mensagens de erro amigáveis

## Boas Práticas

1. **Performance**
   - useCallback para funções
   - Lazy loading de componentes
   - Otimização de re-renders

2. **UX**
   - Loading states informativos
   - Sistema de retry automático
   - Mensagens de erro claras
   - Suporte a temas

3. **Código**
   - TypeScript para type safety
   - Componentes reutilizáveis
   - Props tipadas
   - Documentação clara

## Pré-requisitos

- Node.js 18.x ou superior
- npm 9.x ou superior
- Git
- Conexão com internet para acesso à API

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000  # URL da API
NEXT_PUBLIC_ENV=development                # Ambiente (development/production)
```

## Configuração do Ambiente

1. **Instalação**
```bash
npm install
```

2. **Desenvolvimento**
```bash
npm run dev
```

3. **Build**
```bash
npm run build
```

## API Endpoints

### Carteiras
- GET `/api/v1/portfolios/`: Lista todas as carteiras
  - Retry automático em caso de falha
  - Máximo de 3 tentativas
  - 2 segundos entre tentativas

## Troubleshooting

### Problemas Comuns

1. **Erro de conexão com a API**
   - Verifique se a API está rodando
   - Confirme as variáveis de ambiente
   - Verifique se não há bloqueio de CORS

2. **Erro no build**
   - Limpe a cache: `npm run clean`
   - Delete node_modules: `rm -rf node_modules`
   - Reinstale dependências: `npm install`

3. **Problemas de Performance**
   - Verifique o uso de React.memo
   - Analise re-renders desnecessários
   - Confirme implementação correta de useCallback/useMemo

## Contribuição

1. **Commits**
   - Mensagens claras e descritivas
   - Uma funcionalidade por commit

2. **Code Review**
   - Verificar tipagem TypeScript
   - Garantir suporte a temas
   - Testar tratamento de erros

3. **Testes**
   - Implementar testes unitários
   - Testar diferentes estados (loading, erro, sucesso)
   - Verificar responsividade
