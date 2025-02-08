import logging
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import datetime

from src.models import Portfolio, PortfolioAsset, Transaction
from src.schemas.portfolio_schemas import PortfolioCreate, PortfolioAssetCreate, TransactionCreate

logger = logging.getLogger(__name__)

class PortfolioService:
    def __init__(self, db: Session):
        self.db = db

    def create_portfolio(self, portfolio: PortfolioCreate) -> Portfolio:
        """Cria uma nova carteira"""
        logger.debug(f"[PortfolioService] - create_portfolio - Name: {portfolio.name}")
        db_portfolio = Portfolio(**portfolio.model_dump())
        self.db.add(db_portfolio)
        self.db.commit()
        self.db.refresh(db_portfolio)
        return db_portfolio

    def get_portfolios(self) -> List[Portfolio]:
        """Retorna todas as carteiras"""
        logger.debug("[PortfolioService] - get_portfolios")
        return self.db.query(Portfolio).all()

    def get_portfolio(self, portfolio_id: int) -> Optional[Portfolio]:
        """
        Retorna uma carteira específica com seus ativos e transações
        
        Args:
            portfolio_id (int): ID da carteira a ser buscada
            
        Returns:
            Optional[Portfolio]: Carteira com seus ativos e transações, ou None se não encontrada
        """
        logger.debug(f"[PortfolioService] - get_portfolio - ID: {portfolio_id}")
        return (
            self.db.query(Portfolio)
            .options(
                joinedload(Portfolio.assets),
                joinedload(Portfolio.transactions)
            )
            .filter(Portfolio.id == portfolio_id)
            .first()
        )

    def add_asset(self, asset: PortfolioAssetCreate) -> PortfolioAsset:
        """Adiciona um ativo à carteira"""
        logger.debug(f"[PortfolioService] - add_asset - Symbol: {asset.symbol}")
        db_asset = PortfolioAsset(**asset.model_dump())
        self.db.add(db_asset)
        self.db.commit()
        self.db.refresh(db_asset)
        return db_asset

    def record_transaction(self, transaction: TransactionCreate) -> Transaction:
        """Registra uma nova transação"""
        logger.debug(f"[PortfolioService] - record_transaction - Symbol: {transaction.symbol}")
        db_transaction = Transaction(**transaction.model_dump())
        self.db.add(db_transaction)
        self.db.commit()
        self.db.refresh(db_transaction)
        return db_transaction

    def get_portfolio_performance(self, portfolio_id: int):
        """Calcula o desempenho da carteira"""
        logger.debug(f"[PortfolioService] - get_portfolio_performance - ID: {portfolio_id}")
        # TODO: Implementar cálculo de desempenho
        pass
