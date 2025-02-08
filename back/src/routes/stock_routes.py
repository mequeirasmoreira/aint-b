import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from src.database import get_db
from src.services.finance_service import FinanceService
from src.schemas.stock_schemas import StockPrice
from src.models.stock import Stock  # Import the Stock model

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/stocks/{symbol}", response_model=StockPrice)
def get_stock_price(symbol: str, db: Session = Depends(get_db)):
    """Retorna o preço atual de uma ação"""
    logger.debug(f"[StockRoutes] - get_stock_price - Symbol: {symbol}")
    finance_service = FinanceService(db)
    try:
        stock_data = finance_service.get_current_price(symbol)
        return stock_data
    except Exception as e:
        logger.error(f"[StockRoutes] - get_stock_price - Error: {str(e)}")
        raise HTTPException(status_code=404, detail=f"Preço não encontrado para {symbol}")

@router.get("/stocks/batch/{symbols}", response_model=List[StockPrice])
def get_batch_stock_prices(symbols: str, db: Session = Depends(get_db)):
    """Retorna preços atuais de várias ações (símbolos separados por vírgula)"""
    symbol_list = symbols.split(',')
    logger.debug(f"[StockRoutes] - get_batch_stock_prices - Symbols: {symbol_list}")
    print(f"Recebida requisição para os símbolos: {symbol_list}")  
    
    finance_service = FinanceService(db)
    results = []
    
    for symbol in symbol_list:
        try:
            stock_data = finance_service.get_current_price(symbol.strip())
            print(f"Dados obtidos para {symbol}: {stock_data}")  
            results.append(stock_data)
        except Exception as e:
            logger.error(f"[StockRoutes] - get_batch_stock_prices - Error for {symbol}: {str(e)}")
            print(f"Erro ao buscar dados para {symbol}: {str(e)}")  
            continue
    
    return results

@router.get("/stocks/suggest/{query}")
def suggest_stocks(query: str, db: Session = Depends(get_db)):
    """Retorna sugestões de ativos baseado na busca do usuário"""
    logger.debug(f"[StockRoutes] - suggest_stocks - Query: {query}")
    
    if len(query) < 3:
        return []
    
    # Busca ativos que começam com a query (case insensitive)
    stocks = db.query(Stock).filter(
        Stock.symbol.ilike(f"{query}%")
    ).limit(10).all()
    
    return [
        {
            "symbol": stock.symbol,
            "name": stock.name,
            "sector": stock.sector,
            "subsector": stock.subsector
        }
        for stock in stocks
    ]
