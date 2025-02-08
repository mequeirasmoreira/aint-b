import logging
from sqlalchemy.orm import Session
from src.database import SessionLocal
from src.models.stock import Stock

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def populate_stocks():
    """Popula o banco de dados com ativos da B3"""
    try:
        # Lista de ativos da B3 (você pode expandir essa lista)
        stocks_data = [
            {"symbol": "PETR4", "name": "Petrobras PN", "sector": "Petróleo e Gás"},
            {"symbol": "VALE3", "name": "Vale ON", "sector": "Mineração"},
            {"symbol": "ITUB4", "name": "Itaú Unibanco PN", "sector": "Financeiro"},
            {"symbol": "BBDC4", "name": "Bradesco PN", "sector": "Financeiro"},
            {"symbol": "ABEV3", "name": "Ambev ON", "sector": "Bebidas"},
            {"symbol": "B3SA3", "name": "B3 ON", "sector": "Financeiro"},
            {"symbol": "BBAS3", "name": "Banco do Brasil ON", "sector": "Financeiro"},
            {"symbol": "WEGE3", "name": "WEG ON", "sector": "Bens Industriais"},
            {"symbol": "RENT3", "name": "Localiza ON", "sector": "Aluguel de Carros"},
            {"symbol": "JBSS3", "name": "JBS ON", "sector": "Alimentos"},
            {"symbol": "SUZB3", "name": "Suzano ON", "sector": "Papel e Celulose"},
            {"symbol": "HAPV3", "name": "Hapvida ON", "sector": "Saúde"},
            {"symbol": "MGLU3", "name": "Magazine Luiza ON", "sector": "Varejo"},
            {"symbol": "BPAC11", "name": "BTG Pactual UNT", "sector": "Financeiro"},
            {"symbol": "RAIL3", "name": "Rumo ON", "sector": "Transportes"},
            {"symbol": "BEEF3", "name": "Minerva ON", "sector": "Alimentos"},
            {"symbol": "CASH3", "name": "Méliuz ON", "sector": "Tecnologia"},
            {"symbol": "TOTS3", "name": "Totvs ON", "sector": "Tecnologia"},
            {"symbol": "RADL3", "name": "Raia Drogasil ON", "sector": "Varejo"},
            {"symbol": "BBSE3", "name": "BB Seguridade ON", "sector": "Seguros"}
        ]
        
        db = SessionLocal()
        
        for stock_data in stocks_data:
            try:
                # Verifica se já existe
                existing = db.query(Stock).filter(Stock.symbol == stock_data["symbol"]).first()
                if existing:
                    existing.name = stock_data["name"]
                    existing.sector = stock_data["sector"]
                else:
                    stock = Stock(**stock_data)
                    db.add(stock)
                
                logger.info(f"Processado: {stock_data['symbol']}")
                
            except Exception as e:
                logger.error(f"Erro ao processar {stock_data['symbol']}: {str(e)}")
                continue
        
        db.commit()
        logger.info("Banco de dados populado com sucesso!")
        
    except Exception as e:
        logger.error(f"Erro ao popular banco de dados: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    populate_stocks()
