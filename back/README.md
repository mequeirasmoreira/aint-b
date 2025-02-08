# Backend da Aplicação Financeira

> 💡 **Para Desenvolvedores Júnior**: Este guia vai te ajudar a entender e trabalhar com o backend da nossa aplicação. Pense no backend como o "cérebro" do sistema, que processa todas as informações e regras de negócio!

## Visão Geral
Este é o backend da aplicação financeira, desenvolvido com FastAPI. O sistema fornece endpoints para gerenciamento de carteiras de investimentos e análise financeira.

## 🚀 Começando

### Pré-requisitos
Antes de começar, você precisa ter instalado:
- Python 3.8 ou superior
- Git
- VS Code (recomendado) ou seu editor favorito

### Configuração Inicial

1. **Clone o Repositório**
```bash
git clone https://github.com/seu-usuario/aint-b.git
cd aint-b/back
```

2. **Configure o Ambiente Virtual**
```bash
# No Windows PowerShell
python -m venv venv            # Cria o ambiente virtual
.\venv\Scripts\activate        # Ativa o ambiente virtual
```
> 💡 **Dica**: O ambiente virtual (venv) é como uma "caixa de areia" onde instalamos as dependências do projeto sem afetar seu Python global!

3. **Instale as Dependências**
```bash
pip install -r requirements.txt
```

4. **Inicie o Servidor**
```bash
# IMPORTANTE: Execute este comando na pasta 'back'
uvicorn src.main:app --reload
```
> 💡 **Dica**: O `--reload` faz o servidor reiniciar automaticamente quando você muda o código!

## 📁 Estrutura do Projeto

```
back/
├── src/
│   ├── routes/          # Onde definimos os endpoints da API
│   │   ├── finance_routes.py    # Rotas financeiras (ex: /stocks)
│   │   └── portfolio_routes.py  # Rotas de carteiras (ex: /portfolios)
│   ├── services/        # Lógica de negócios
│   │   └── scheduler_service.py # Serviço que roda tarefas automáticas
│   ├── schemas/         # Define a estrutura dos dados
│   ├── models.py        # Modelos do banco de dados
│   ├── database.py      # Configuração do banco de dados
│   └── main.py         # Arquivo principal que inicia tudo
├── data/               # Arquivos de dados
├── requirements.txt    # Lista de dependências
└── venv/              # Ambiente virtual Python
```

## 💻 Exemplos de Código

### 1. Como Criar uma Nova Rota
```python
# src/routes/portfolio_routes.py
from fastapi import APIRouter, HTTPException
from ..schemas.portfolio import PortfolioCreate
import logging

# Configurar o logger
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/portfolios/")
async def create_portfolio(portfolio: PortfolioCreate):
    try:
        # 👉 Sempre use logging para debug
        logger.debug(f"[PortfolioRoutes] - create_portfolio - Data: {portfolio}")
        
        # Sua lógica aqui...
        result = await save_portfolio(portfolio)
        
        return {"message": "Portfolio criado!", "data": result}
    except Exception as e:
        # 👉 Sempre trate erros adequadamente
        logger.error(f"[PortfolioRoutes] - create_portfolio - Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar portfolio")
```

### 2. Como Usar um Schema Pydantic
```python
# src/schemas/portfolio.py
from pydantic import BaseModel, Field
from typing import List, Optional

class StockItem(BaseModel):
    symbol: str = Field(..., description="Símbolo da ação (ex: PETR4.SA)")
    quantity: int = Field(..., gt=0, description="Quantidade de ações")
    
class PortfolioCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    stocks: List[StockItem] = []
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Minha Carteira",
                "description": "Carteira de ações brasileiras",
                "stocks": [
                    {"symbol": "PETR4.SA", "quantity": 100}
                ]
            }
        }
```

## 🔍 Como Testar a API

1. **Acesse a Documentação Interativa**
   - Abra `http://localhost:8000/docs` no navegador
   - Você verá todos os endpoints disponíveis
   - Pode testar cada endpoint diretamente na interface!

2. **Usando o Thunder Client (VS Code) ou Postman**
```http
### Criar uma nova carteira
POST http://localhost:8000/api/v1/portfolios
Content-Type: application/json

{
    "name": "Minha Carteira",
    "description": "Investimentos em ações",
    "stocks": [
        {
            "symbol": "PETR4.SA",
            "quantity": 100
        }
    ]
}
```

## 🎯 Principais Funcionalidades

### 1. Gerenciamento de Carteiras
- Criar, listar, atualizar e deletar carteiras
- Adicionar e remover ações
- Calcular valor total e rentabilidade

### 2. Monitoramento de Ações
- Atualização automática de preços
- Alertas de variação
- Histórico de preços

### 3. Análise Financeira
- Cálculo de rentabilidade
- Distribuição por setor
- Análise de risco

## 🛠️ Ferramentas e Tecnologias

- **FastAPI**: Framework super rápido para APIs
  ```python
  from fastapi import FastAPI
  app = FastAPI(title="Aint-B API")
  ```

- **SQLAlchemy**: Para banco de dados
  ```python
  from sqlalchemy import create_engine
  engine = create_engine("sqlite:///./sql_app.db")
  ```

- **Pydantic**: Para validação de dados
  ```python
  from pydantic import BaseModel
  class User(BaseModel):
      name: str
      age: int
  ```

## 🐛 Solução de Problemas

### 1. Erro: "Module Not Found"
```bash
# ❌ Erro comum
ModuleNotFoundError: No module named 'src'

# ✅ Solução
# Certifique-se de estar na pasta 'back' ao executar:
cd back
uvicorn src.main:app --reload
```

### 2. Erro: "Import Could Not Be Resolved"
```python
# ❌ Erro no VS Code
from ..schemas import PortfolioCreate  # Linha vermelha

# ✅ Solução
# Adicione esta pasta ao Python Path do VS Code
# settings.json:
{
    "python.analysis.extraPaths": ["./src"]
}
```

## 📝 Boas Práticas

### 1. Logging
```python
# ✅ Faça assim
logger.debug(f"[NomeClasse] - metodo - Info: {variavel}")

# ❌ Não faça assim
print(f"erro: {variavel}")
```

### 2. Tratamento de Erros
```python
# ✅ Faça assim
try:
    result = await process_data()
except Exception as e:
    logger.error(f"[Class] - method - Error: {str(e)}")
    raise HTTPException(status_code=500, detail="Mensagem amigável")

# ❌ Não faça assim
result = await process_data()  # Sem try/catch
```

### 3. Validação de Dados
```python
# ✅ Faça assim
class CreateUser(BaseModel):
    name: str = Field(..., min_length=2)
    age: int = Field(..., gt=0, lt=150)

# ❌ Não faça assim
@router.post("/users")
def create_user(name: str, age: int):
    # Sem validação
    pass
```

## 🤝 Como Contribuir

1. Crie uma branch para sua feature
```bash
git checkout -b feature/nova-funcionalidade
```

2. Faça commit das mudanças
```bash
git commit -m "feat: adiciona nova funcionalidade"
```

3. Push para a branch
```bash
git push origin feature/nova-funcionalidade
```

4. Abra um Pull Request

## 🆘 Precisa de Ajuda?

- Consulte a [documentação do FastAPI](https://fastapi.tiangolo.com/)
- Verifique os logs em `logs/app.log`
- Pergunte no canal #backend do Discord
