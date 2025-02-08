# Composição de dados

### Usuário
Armazena informações sobre os usuários
```SQL
users {
	ID integer pk increments unique 
	UID string unique
	displayName string
	email string unique
	phone string(11) unique
	provider string
	createdAt datetime
	lastSignin datetime
}
```
ID: Chave primária auto-incrementável<br>
UID: Identificador único do usuário<br>
displayName: Nome de exibição do usuário<br>
email: Endereço de e-mail do usuário<br>
phone: Telefone do usuário<br>
provider: Provedor de autenticação<br>
createdAt: Data de criação do usuário<br>
lastSignin: Data da última autenticação do usuário<br>

### Preferências do Usuário
```SQL
userPreferences {
	userID integer pk > Users.ID
	theme string
	language string
	receiveNotifications boolean
}
```

### Portfolios
Carteiras de investimento do usuário
```SQL
portfolios {
	portfolioID integer pk increments
	userID integer > Users.ID
	portfolioName string
	createdAt datetime
}
```
portfolioID: Chave primária auto-incrementável<br>
userID: Chave primária do usuário (chave estrangeira)<br>
portfolioName: Nome da carteira<br>
createdAt: Data de criação da carteira<br>

### Impostos e Taxas
Taxas e impostos aplicados aos ativos
```SQL
taxes {
	taxID integer pk increments
	userID integer > Users.ID
	transactionID integer > Transactions.TransactionID
	taxAmount decimal
	taxType string
	dueDate date
}
```

## Dados do Mercado e das Ações
### Ativos / Stocks
Ativos e ações listados na bolsa (B3 e NASDQ)
```SQL
assets {
	symbol string unique
	assetID integer pk
	assetName integer
	assetType integer
	companyID integer > Companies.CompanyID
	exchange integer
	currency integer
	ISIN string
}
```
symbol: Símbolo do ativo<br>
assetID: Chave primária auto-incrementável<br>
assetName: Nome do ativo<br>
assetType: Tipo de ativo<br>
companyID: Chave primária da empresa<br>
exchange: Código da bolsa<br>
currency: Moeda<br>
ISIN: Número de identificação do ativo<br>

### Transações
Transações realizadas pelo usuário
```SQL
transactions {
	transactionID integer pk increments
	portfolioID integer > Portfolios.PortfolioID
	symbol string > Assets.Symbol
	quantity integer
	purchasePrice decimal
	transactionDate datetime
	ransactionType string
}
```
transactionID: Chave primária auto-incrementável<br>
portfolioID: Chave primária do usuário (chave estrangeira)<br>
symbol: Símbolo do ativo<br>
quantity: Quantidade<br>
purchasePrice: Preço de compra<br>
transactionDate: Data da transação<br>
ransactionType: Tipo de transação<br>

### Empresas / Companies
Empresas e instituições financeiras listadas na bolsa (B3 e NASDQ)
```SQL
companies {
	CompanyID integer pk
	CompanyName string
	CNPJ string
	Sector string
	Subsector string
	Website string
}
```
### Informações do Ativo
Dados históricos de preços dos ativos
```SQL
quotes {
	QuoteID integer pk increments
	AssetID integer unique > Assets.AssetID
	Date date unique
	Open decimal
	High decimal
	Low decimal
	Close decimal
	AdjustedClose decimal
	Volume integer
}
```
QuoteID: Chave primária auto-incrementável<br>
AssetID: Chave primária do ativo (chave estrangeira)<br>
Date: Data do preço<br>
Open: Preço de abertura<br>
High: Preço máximo<br>
Low: Preço mínimo<br>
Close: Preço de fechamento<br>
AdjustedClose: Preço de fechamento ajustado<br>
Volume: Volume<br>

### Divdendos
Registro histórico de divdendos
```SQL
dividends {
	DividendID integer pk increments
	AssetID integer > Assets.AssetID
	PaymentDate date
	Amount decimal
	Type string
}

```
DividendID: Chave primária auto-incrementável<br>
AssetID: Chave primária do ativo (chave estrangeira)<br>
PaymentDate: Data da divdenda<br>
Amount: Quantidade da divdenda<br>
Type: Tipo da divdenda<br>

### Decisões e ações da empresa
Grid de informações sobre decisões e ações da empresa
```SQL
corporateActions {
	ActionID integer pk increments
	AssetID integer > Assets.AssetID
	ActionDate date
	ActionType string
	Ratio decimal
}
```
ActionID: Chave primária auto-incrementável<br>
AssetID: Chave primária do ativo (chave estrangeira)<br>
ActionDate: Data da ação<br>
ActionType: Tipo da ação<br>
Ratio: Taxa de ação<br>

## Funcionalidades da Plataforma
### Lista de Ativos acompanhados
Listas de ativos que o usuário está monitorando
```SQL
watchlists {
	WatchlistID integer pk increments
	UserID integer > Users.ID
	WatchlistName string
}
```
WatchlistID: Chave primária auto-incrementável<br>
UserID: Chave primária do usuário (chave estrangeira)<br>
WatchlistName: Nome da lista de acompanhamento<br>

### Tabela de junção entre Watchlists e Assets
```SQL
watchlistAssets {
	WatchlistID integer pk > Watchlists.WatchlistID
	AssetID integer pk > Assets.AssetID
}
```
WatchlistID: Chave primária da lista de acompanhamento (chave estrangeira)<br>
AssetID: Chave primária do ativo (chave estrangeira)<br>

### Alertas dos ativos
Alertas personalizados para o usuário
```SQL
alerts {
	AlertID integer pk increments
	UserID integer > Users.ID
	AssetID integer > Assets.AssetID
	AlertType string
	Threshold decimal
	IsActive boolean
}
```
AlertID: Chave primária auto-incrementável<br>
UserID: Chave primária do usuário (chave estrangeira)<br>
AssetID: Chave primária do ativo (chave estrangeira)<br>
AlertType: Tipo de alerta<br>
Threshold: Limite de alerta<br>
IsActive: Indica se a alerta está ativa ou não<br>

### Noticícias
Artigos de notícias e análises sobre os ativos.
```SQL
news {
	NewsID integer pk increments
	AssetID integer > Assets.AssetID
	Title string
	Content text
	PublicationDate datetime
	Source string
}
```
NewsID: Chave primária auto-incrementável<br>
AssetID: Chave primária do ativo (chave estrangeira)<br>
Title: Título da notícia<br>
Content: Conteúdo da notícia<br>
PublicationDate: Data de publicação da notícia<br>
Source: Fonte da notícia<br>

## Fundamentos e Análise Técnica
### Demostrativo Financeiro
Balanços patrimoniais, demonstrações de resultados e demonstrativos de fluxo de caixa
```SQL
financialStatements {
	statementID integer pk increments
	companyID integer unique > Companies.CompanyID
	statementType string unique
	fiscalYear integer unique
	fiscalPeriod string unique
	revenue decimal
	netIncome decimal
	assets decimal
	liabilities decimal
}
```
statementID: Chave primária auto-incrementável<br>
companyID: Chave primária da empresa (chave estrangeira)<br>
statementType: Tipo de demonstrativo<br>
fiscalYear: Ano fiscal<br>
fiscalPeriod: Período fiscal<br>
revenue: Receita<br>
netIncome: Receita líquida<br>
assets: Ativos<br>
liabilities: Passivos<br>

### KPI's
KPI's para análise de desempenho
```SQL
keyMetrics {
	metricID integer pk increments
	companyID integer > Companies.CompanyID
	metricName string
	metricValue decimal
	date date
}
```
metricID: Chave primária auto-incrementável<br>
companyID: Chave primária da empresa (chave estrangeira)<br>
metricName: Nome do KPI<br>
metricValue: Valor do KPI<br>
date: Data do KPI<br>