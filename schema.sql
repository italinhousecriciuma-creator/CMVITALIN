-- =============================================
-- CMV PRO - ITAL'IN HOUSE
-- Schema para Neon PostgreSQL
-- =============================================

-- Ingredientes
CREATE TABLE IF NOT EXISTS ingredientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  un VARCHAR(20) DEFAULT 'kg',
  custo DECIMAL(10,2) DEFAULT 0,
  forn VARCHAR(255) DEFAULT ''
);

-- Massas
CREATE TABLE IF NOT EXISTS massas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  custo_p DECIMAL(10,2) DEFAULT 0,
  custo_g DECIMAL(10,2) DEFAULT 0
);

-- Extras
CREATE TABLE IF NOT EXISTS extras (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  preco DECIMAL(10,2) DEFAULT 0,
  custo DECIMAL(10,2) DEFAULT 0
);

-- Bebidas
CREATE TABLE IF NOT EXISTS bebidas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  preco DECIMAL(10,2) DEFAULT 0,
  custo DECIMAL(10,2) DEFAULT 0
);

-- Brindes
CREATE TABLE IF NOT EXISTS brindes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL
);

-- Produtos (4 preços: iFood P/G, AnotaAi P/G)
CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cat VARCHAR(50) DEFAULT 'macarrao',
  ifood_p DECIMAL(10,2) DEFAULT 0,
  ifood_g DECIMAL(10,2) DEFAULT 0,
  anota_p DECIMAL(10,2) DEFAULT 0,
  anota_g DECIMAL(10,2) DEFAULT 0
);

-- Combos
CREATE TABLE IF NOT EXISTS combos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  preco_ifood DECIMAL(10,2) DEFAULT 0,
  preco_anota DECIMAL(10,2) DEFAULT 0,
  qp INTEGER DEFAULT 0,
  qg INTEGER DEFAULT 0,
  bebida_id INTEGER REFERENCES bebidas(id),
  brinde_id INTEGER REFERENCES brindes(id)
);

-- Fichas Técnicas
CREATE TABLE IF NOT EXISTS fichas (
  id SERIAL PRIMARY KEY,
  produto_id INTEGER NOT NULL REFERENCES produtos(id),
  tamanho CHAR(1) DEFAULT 'G',
  ingrediente_id INTEGER NOT NULL REFERENCES ingredientes(id),
  qtd DECIMAL(10,3) DEFAULT 0
);

-- Vendas (importações mensais)
CREATE TABLE IF NOT EXISTS vendas (
  id SERIAL PRIMARY KEY,
  mes VARCHAR(2) NOT NULL,
  ano VARCHAR(4) NOT NULL,
  cardapio VARCHAR(20) NOT NULL,
  grupos JSONB DEFAULT '[]',
  itens_combo JSONB DEFAULT '[]',
  total_qtd INTEGER DEFAULT 0,
  total_fat DECIMAL(12,2) DEFAULT 0,
  total_custo DECIMAL(12,2) DEFAULT 0,
  UNIQUE(mes, ano, cardapio)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_fichas_produto ON fichas(produto_id, tamanho);
CREATE INDEX IF NOT EXISTS idx_vendas_periodo ON vendas(ano, mes, cardapio);
