# Componentes do Aint-B

> 💡 **Para Desenvolvedores Júnior**: Este guia explica como criar e usar componentes no projeto. Cada componente é como uma peça de LEGO que podemos reutilizar em diferentes partes da aplicação!

## Como Criar um Novo Componente

### 1. Estrutura de Pastas
Primeiro, crie uma nova pasta dentro de `components/` com o nome do seu componente:

```
components/
├── SeuComponente/
│   ├── index.tsx          # Código principal do componente
│   ├── types.ts           # Tipos TypeScript
│   └── styles.ts          # Estilos (se necessário)
```

### 2. Exemplo de Componente
Aqui está um exemplo completo de como criar um componente:

```typescript
// components/BotaoCustomizado/types.ts
export interface BotaoCustomizadoProps {
  texto: string;
  onClick: () => void;
  tipo?: 'primario' | 'secundario';
}

// components/BotaoCustomizado/index.tsx
import { useEffect } from 'react';
import logger from '@/utils/logger';
import { BotaoCustomizadoProps } from './types';

export function BotaoCustomizado({ 
  texto, 
  onClick, 
  tipo = 'primario' 
}: BotaoCustomizadoProps) {
  // 👉 Sempre logue quando o componente montar
  useEffect(() => {
    logger.debug('[BotaoCustomizado] - mount - props:', { texto, tipo });
  }, [texto, tipo]);

  // 👉 Classes do Tailwind para estilização
  const estilos = tipo === 'primario'
    ? 'bg-blue-500 hover:bg-blue-700'
    : 'bg-gray-500 hover:bg-gray-700';

  return (
    <button
      className={`${estilos} text-white font-bold py-2 px-4 rounded`}
      onClick={() => {
        // 👉 Logue antes de executar a ação
        logger.debug('[BotaoCustomizado] - click');
        onClick();
      }}
    >
      {texto}
    </button>
  );
}
```

### 3. Como Usar o Componente
```typescript
import { BotaoCustomizado } from '@/components/BotaoCustomizado';

export default function SuaPagina() {
  return (
    <div>
      <BotaoCustomizado 
        texto="Clique Aqui!"
        onClick={() => alert('Botão clicado!')}
        tipo="primario"
      />
    </div>
  );
}
```

## Boas Práticas

### 1. Logging
Sempre adicione logs para facilitar o debug:
```typescript
// ✅ Faça assim
logger.debug(`[${NOME_COMPONENTE}] - ${NOME_METODO} - parâmetros:`, { param1, param2 });

// ❌ Não faça assim
console.log('erro no componente');
```

### 2. Tratamento de Erros
```typescript
// ✅ Faça assim
try {
  await carregarDados();
} catch (error) {
  logger.error('[SeuComponente] - Erro:', error);
  setError('Ops! Algo deu errado. Tente novamente.');
}

// ❌ Não faça assim
await carregarDados(); // Sem try/catch
```

### 3. Props
Sempre defina tipos para suas props:
```typescript
// ✅ Faça assim
interface SuasProps {
  nome: string;        // Obrigatório
  idade?: number;      // Opcional
  onSave: () => void; // Função
}

// ❌ Não faça assim
function Componente(props: any) { ... }
```

## Componentes Principais

### LoadingIndicator
Mostra um spinner de carregamento com mensagem:

```typescript
<LoadingIndicator 
  message="Carregando..."    // Mensagem para o usuário
  retryCount={2}            // Número da tentativa atual
  maxRetries={3}           // Máximo de tentativas
/>
```

### CarteirasGrid
Exibe carteiras em formato de grid:

```typescript
<CarteirasGrid 
  // O componente já possui tratamento interno de:
  // - Loading
  // - Erro
  // - Retry automático
  // - Tema claro/escuro
/>
```

### ThemeSwitcher
Botão para alternar entre temas:

```typescript
<ThemeSwitcher 
  // Não precisa de props!
  // Usa o ThemeContext internamente
/>
```

## Dicas de Performance

1. **Memoização**: Use quando o componente re-renderiza muito
```typescript
// ✅ Faça assim
const MeuComponente = memo(function MeuComponente() {
  return <div>Conteúdo</div>;
});

// ❌ Não faça assim (se tiver muitos re-renders)
function MeuComponente() {
  return <div>Conteúdo</div>;
}
```

2. **useCallback**: Para funções passadas como props
```typescript
// ✅ Faça assim
const handleClick = useCallback(() => {
  // sua lógica aqui
}, [/* dependências */]);

// ❌ Não faça assim
const handleClick = () => {
  // sua lógica aqui
};
```

3. **useMemo**: Para cálculos pesados
```typescript
// ✅ Faça assim
const resultado = useMemo(() => {
  return dados.filter(item => item.valor > 1000);
}, [dados]);

// ❌ Não faça assim
const resultado = dados.filter(item => item.valor > 1000);
