import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from src.database import get_db
from src.services.portfolio_service import PortfolioService
from src.schemas.portfolio_schemas import (
    Portfolio, PortfolioCreate, 
    PortfolioAsset, PortfolioAssetCreate,
    Transaction, TransactionCreate,
    PortfolioWithDetails
)

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/portfolios/", response_model=Portfolio)
def create_portfolio(portfolio: PortfolioCreate, db: Session = Depends(get_db)):
    """Cria uma nova carteira"""
    logger.debug(f"[PortfolioRoutes] - create_portfolio - Name: {portfolio.name}")
    portfolio_service = PortfolioService(db)
    return portfolio_service.create_portfolio(portfolio)

@router.get("/portfolios/", response_model=List[Portfolio])
def list_portfolios(db: Session = Depends(get_db)):
    """Lista todas as carteiras"""
    logger.debug("[PortfolioRoutes] - list_portfolios")
    portfolio_service = PortfolioService(db)
    return portfolio_service.get_portfolios()

@router.get("/portfolios/{portfolio_id}", response_model=PortfolioWithDetails)
def get_portfolio(portfolio_id: int, db: Session = Depends(get_db)):
    """Retorna detalhes de uma carteira específica"""
    logger.debug(f"[PortfolioRoutes] - get_portfolio - ID: {portfolio_id}")
    portfolio_service = PortfolioService(db)
    portfolio = portfolio_service.get_portfolio(portfolio_id)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return portfolio

@router.post("/portfolios/assets/", response_model=PortfolioAsset)
def add_asset(asset: PortfolioAssetCreate, db: Session = Depends(get_db)):
    """Adiciona um ativo a uma carteira"""
    logger.debug(f"[PortfolioRoutes] - add_asset - Symbol: {asset.symbol}")
    portfolio_service = PortfolioService(db)
    return portfolio_service.add_asset(asset)

@router.post("/portfolios/transactions/", response_model=Transaction)
def record_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    """Registra uma nova transação"""
    logger.debug(f"[PortfolioRoutes] - record_transaction - Symbol: {transaction.symbol}")
    portfolio_service = PortfolioService(db)
    return portfolio_service.record_transaction(transaction)
