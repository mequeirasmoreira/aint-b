import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy.orm import Session
from .finance_service import FinanceService

logger = logging.getLogger(__name__)

class SchedulerService:
    def __init__(self, db: Session):
        self.db = db
        self.scheduler = BackgroundScheduler()
        self.finance_service = FinanceService(db)
        
    def start(self, symbols: list[str]):
        """
        Inicia o scheduler para atualizar dados das ações periodicamente
        """
        logger.debug(f"[SchedulerService] - start - Starting scheduler for symbols: {symbols}")
        
        # Atualiza dados a cada dia útil às 18:00 (após o fechamento do mercado)
        self.scheduler.add_job(
            self._update_stocks_data,
            CronTrigger(day_of_week='mon-fri', hour=18),
            args=[symbols],
            id='update_stocks'
        )
        
        self.scheduler.start()
        
    def _update_stocks_data(self, symbols: list[str]):
        """
        Atualiza dados de todas as ações configuradas
        """
        logger.debug(f"[SchedulerService] - _update_stocks_data - Updating data for symbols: {symbols}")
        
        for symbol in symbols:
            df = self.finance_service.fetch_stock_data(symbol, period="1d")
            self.finance_service.save_stock_data(symbol, df)
