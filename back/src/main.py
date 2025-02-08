import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database import engine, Base, SessionLocal
from src.routes import finance_routes, portfolio_routes, stock_routes
from src.services.scheduler_service import SchedulerService
from src.models import Stock  # Importa o modelo Stock

# Configuração do logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Cria as tabelas do banco de dados
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Finance API")

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL do frontend Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui as rotas
app.include_router(finance_routes.router, prefix="/api/v1")
app.include_router(portfolio_routes.router, prefix="/api/v1")
app.include_router(stock_routes.router, prefix="/api/v1")  # Adiciona as rotas de stocks

# Lista de ações para monitorar
SYMBOLS = ["PETR4.SA", "VALE3.SA", "ITUB4.SA"]  # Exemplo com ações brasileiras

@app.on_event("startup")
async def startup_event():
    """
    Inicializa o scheduler quando a aplicação é iniciada
    """
    logger.debug("[Main] - startup_event - Iniciando a aplicação")
    db = SessionLocal()
    scheduler = SchedulerService(db)
    scheduler.start(SYMBOLS)

@app.get("/")
async def root():
    return {"message": "Finance API is running"}
