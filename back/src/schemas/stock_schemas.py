from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class StockPrice(BaseModel):
    symbol: str
    price: float
    change_percent: float
    updated_at: datetime
    volume: Optional[int] = None
    high: Optional[float] = None
    low: Optional[float] = None
    
    class Config:
        from_attributes = True
