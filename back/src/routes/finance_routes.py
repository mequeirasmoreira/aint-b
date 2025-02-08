import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from src.database import get_db
from src.services.finance_service import FinanceService
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter()

class StockData(BaseModel):
    symbol: str
    date: datetime
    open: float
    high: float
    low: float
    close: float
    volume: int
    moving_avg_20: float | None
    volatility: float | None

@router.get("/stocks/{symbol}", response_model=List[StockData])
def get_stock_data(
    symbol: str,
    days: int = 30,
    db: Session = Depends(get_db)
):
    """
    Retorna dados históricos de uma ação
    """
    logger.debug(f"[FinanceRoutes] - get_stock_data - Symbol: {symbol}, Days: {days}")
    
    try:
        finance_service = FinanceService(db)
        df = finance_service.fetch_stock_data(symbol, period=f"{days}d")
        return df.reset_index().to_dict('records')
    except Exception as e:
        logger.error(f"[FinanceRoutes] - get_stock_data - Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stocks/{symbol}/realtime")
def get_realtime_data(symbol: str, db: Session = Depends(get_db)):
    """
    Retorna dados em tempo real de uma ação
    """
    logger.debug(f"[FinanceRoutes] - get_realtime_data - Symbol: {symbol}")
    
    try:
        finance_service = FinanceService(db)
        df = finance_service.fetch_stock_data(symbol, period="1d")
        
        if df.empty:
            raise HTTPException(
                status_code=404,
                detail=f"Nenhum dado encontrado para o símbolo {symbol}"
            )
        
        # Pega a última linha e formata como dicionário
        latest_data = df.iloc[-1].to_dict()
        
        # Retorna apenas o preço atual e o volume
        return {
            "price": latest_data["close"],
            "volume": latest_data["volume"]
        }
        
    except Exception as e:
        logger.error(f"[FinanceRoutes] - get_realtime_data - Error: {str(e)}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
