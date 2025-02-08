import logging
import yfinance as yf
import pandas as pd
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from .. import models

logger = logging.getLogger(__name__)

class FinanceService:
    def __init__(self, db: Session):
        self.db = db

    def _add_br_suffix(self, symbol: str) -> str:
        """
        Adiciona o sufixo .SA para ações brasileiras se necessário
        """
        if not symbol.endswith('.SA'):
            return f"{symbol}.SA"
        return symbol

    def fetch_stock_data(self, symbol: str, period: str = "1mo") -> pd.DataFrame:
        """
        Busca dados históricos de uma ação usando yfinance
        """
        symbol = self._add_br_suffix(symbol)
        logger.debug(f"[FinanceService] - fetch_stock_data - Symbol: {symbol}, Period: {period}")
        ticker = yf.Ticker(symbol)
        df = ticker.history(period=period)
        return self._process_data(df, symbol)

    def _process_data(self, df: pd.DataFrame, symbol: str) -> pd.DataFrame:
        """
        Processa os dados, calculando médias móveis e volatilidade
        """
        logger.debug(f"[FinanceService] - _process_data - Processing data for symbol: {symbol}")
        
        if df.empty:
            raise ValueError(f"Nenhum dado encontrado para o símbolo {symbol}")
        
        # Remove o sufixo .SA do símbolo
        symbol = symbol.replace('.SA', '')
        
        # Calcula média móvel de 20 dias
        df['MA20'] = df['Close'].rolling(window=20).mean()
        
        # Calcula volatilidade (desvio padrão dos retornos em 20 dias)
        df['Returns'] = df['Close'].pct_change()
        df['Volatility'] = df['Returns'].rolling(window=20).std() * (252 ** 0.5)  # Anualizado
        
        # Formata os dados conforme o modelo StockData
        df = df.reset_index()
        df = df.rename(columns={
            'Open': 'open',
            'High': 'high',
            'Low': 'low',
            'Close': 'close',
            'Volume': 'volume',
            'MA20': 'moving_avg_20',
            'Volatility': 'volatility',
            'Date': 'date'
        })
        
        # Adiciona a coluna symbol
        df['symbol'] = symbol
        
        # Seleciona apenas as colunas necessárias
        columns = ['symbol', 'date', 'open', 'high', 'low', 'close', 'volume', 'moving_avg_20', 'volatility']
        df = df[columns]
        
        return df

    def save_stock_data(self, symbol: str, df: pd.DataFrame):
        """
        Salva os dados processados no banco de dados
        """
        logger.debug(f"[FinanceService] - save_stock_data - Saving data for symbol: {symbol}")
        
        for index, row in df.iterrows():
            stock_data = models.StockData(
                symbol=row['symbol'],
                date=row['date'],
                open=row['open'],
                high=row['high'],
                low=row['low'],
                close=row['close'],
                volume=row['volume'],
                moving_avg_20=row['moving_avg_20'],
                volatility=row['volatility']
            )
            self.db.add(stock_data)
        
        self.db.commit()

    def get_current_price(self, symbol: str) -> dict:
        """
        Retorna o preço atual de uma ação
        """
        symbol = self._add_br_suffix(symbol)
        logger.debug(f"[FinanceService] - get_current_price - Symbol: {symbol}")
        
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            # Busca dados do dia atual
            today_data = ticker.history(period='1d')
            
            if today_data.empty:
                raise ValueError(f"Nenhum dado encontrado para {symbol}")
            
            return {
                "symbol": symbol.replace('.SA', ''),
                "price": today_data['Close'].iloc[-1],
                "change_percent": (today_data['Close'].iloc[-1] - today_data['Open'].iloc[0]) / today_data['Open'].iloc[0] * 100,
                "updated_at": datetime.now(),
                "volume": int(today_data['Volume'].iloc[-1]),
                "high": float(today_data['High'].iloc[-1]),
                "low": float(today_data['Low'].iloc[-1])
            }
            
        except Exception as e:
            logger.error(f"[FinanceService] - get_current_price - Error fetching data for {symbol}: {str(e)}")
            raise ValueError(f"Erro ao buscar dados para {symbol}")
