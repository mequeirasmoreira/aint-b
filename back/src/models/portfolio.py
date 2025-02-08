from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from src.database import Base
from datetime import datetime

class Portfolio(Base):
    """
    Modelo para carteiras de investimento
    """
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    description = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    assets = relationship("PortfolioAsset", back_populates="portfolio")
    transactions = relationship("Transaction", back_populates="portfolio")

class PortfolioAsset(Base):
    """
    Modelo para ativos em uma carteira
    """
    __tablename__ = "portfolio_assets"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"))
    symbol = Column(String(10))
    quantity = Column(Float)
    purchase_price = Column(Float)
    purchase_date = Column(DateTime)
    notes = Column(String(500), nullable=True)
    
    # Relacionamentos
    portfolio = relationship("Portfolio", back_populates="assets")

class Transaction(Base):
    """
    Modelo para transações (compra/venda) de ativos
    """
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"))
    symbol = Column(String(10))
    quantity = Column(Float)
    price = Column(Float)
    date = Column(DateTime)
    type = Column(String(10))  # 'buy' ou 'sell'
    notes = Column(String(500), nullable=True)
    
    # Relacionamentos
    portfolio = relationship("Portfolio", back_populates="transactions")
