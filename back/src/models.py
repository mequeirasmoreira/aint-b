from sqlalchemy import Column, Integer, String, Float, DateTime
from .database import Base

class StockData(Base):
    __tablename__ = "stock_data"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    date = Column(DateTime, index=True)
    open = Column(Float)
    high = Column(Float)
    low = Column(Float)
    close = Column(Float)
    volume = Column(Integer)
    moving_avg_20 = Column(Float, nullable=True)
    volatility = Column(Float, nullable=True)


from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Numeric, Date, Text
from sqlalchemy.orm import relationship
from src.database import Base

class Portfolio(Base):
    """Modelo para carteiras de investimentos"""
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relacionamentos
    assets = relationship("PortfolioAsset", back_populates="portfolio", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="portfolio", cascade="all, delete-orphan")

class PortfolioAsset(Base):
    """Modelo para ativos em uma carteira"""
    __tablename__ = "portfolio_assets"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"), nullable=False)
    symbol = Column(String(20), nullable=False)
    quantity = Column(Numeric(10, 2), nullable=False)
    purchase_price = Column(Numeric(10, 2), nullable=False)
    purchase_date = Column(Date, nullable=False)
    notes = Column(Text)

    # Relacionamentos
    portfolio = relationship("Portfolio", back_populates="assets")

class Transaction(Base):
    """Modelo para histórico de transações"""
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"), nullable=False)
    symbol = Column(String(20), nullable=False)
    operation_type = Column(String(10), nullable=False)  # 'BUY' ou 'SELL'
    quantity = Column(Numeric(10, 2), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    date = Column(DateTime, nullable=False, default=datetime.utcnow)

    # Relacionamentos
    portfolio = relationship("Portfolio", back_populates="transactions")
