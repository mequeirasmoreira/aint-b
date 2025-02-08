import logging
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

logger = logging.getLogger(__name__)

# Obtém o caminho absoluto para o diretório data
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_PATH = os.path.join(BASE_DIR, "data", "finance.db")

# Garante que o diretório data existe
os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)

SQLALCHEMY_DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    logger.debug("[Database] - get_db - Criando nova sessão do banco de dados")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
