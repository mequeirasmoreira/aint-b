from datetime import datetime, date
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel

# Schemas para Portfolio
class PortfolioBase(BaseModel):
    name: str
    description: Optional[str] = None

class PortfolioCreate(PortfolioBase):
    pass

class Portfolio(PortfolioBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Schemas para PortfolioAsset
class PortfolioAssetBase(BaseModel):
    symbol: str
    quantity: Decimal
    purchase_price: Decimal
    purchase_date: date
    notes: Optional[str] = None

class PortfolioAssetCreate(PortfolioAssetBase):
    portfolio_id: int

class PortfolioAsset(PortfolioAssetBase):
    id: int
    portfolio_id: int

    class Config:
        from_attributes = True

# Schemas para Transaction
class TransactionBase(BaseModel):
    symbol: str
    operation_type: str  # 'BUY' ou 'SELL'
    quantity: Decimal
    price: Decimal
    date: datetime

class TransactionCreate(TransactionBase):
    portfolio_id: int

class Transaction(TransactionBase):
    id: int
    portfolio_id: int

    class Config:
        from_attributes = True

# Schema para Portfolio com relacionamentos
class PortfolioWithDetails(Portfolio):
    assets: List[PortfolioAsset] = []
    transactions: List[Transaction] = []

    class Config:
        from_attributes = True
