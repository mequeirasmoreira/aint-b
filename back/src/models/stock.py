from sqlalchemy import Column, String, Integer
from src.database import Base

class Stock(Base):
    """
    Modelo para armazenar informações básicas de ações
    """
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(10), unique=True, index=True)
    name = Column(String(100))
    sector = Column(String(50), nullable=True)
    subsector = Column(String(50), nullable=True)
