const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    await sql`CREATE TABLE IF NOT EXISTS ingredientes (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      un VARCHAR(20) DEFAULT 'kg',
      custo DECIMAL(10,2) DEFAULT 0,
      forn VARCHAR(255) DEFAULT ''
    )`;

    await sql`CREATE TABLE IF NOT EXISTS massas (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      custo_p DECIMAL(10,2) DEFAULT 0,
      custo_g DECIMAL(10,2) DEFAULT 0
    )`;

    await sql`CREATE TABLE IF NOT EXISTS extras (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      preco DECIMAL(10,2) DEFAULT 0,
      custo DECIMAL(10,2) DEFAULT 0
    )`;

    await sql`CREATE TABLE IF NOT EXISTS bebidas (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      preco DECIMAL(10,2) DEFAULT 0,
      custo DECIMAL(10,2) DEFAULT 0
    )`;

    await sql`CREATE TABLE IF NOT EXISTS brindes (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL
    )`;

    await sql`CREATE TABLE IF NOT EXISTS produtos (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      cat VARCHAR(50) DEFAULT 'macarrao',
      ifood_p DECIMAL(10,2) DEFAULT 0,
      ifood_g DECIMAL(10,2) DEFAULT 0,
      anota_p DECIMAL(10,2) DEFAULT 0,
      anota_g DECIMAL(10,2) DEFAULT 0
    )`;

    await sql`CREATE TABLE IF NOT EXISTS combos (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      preco_ifood DECIMAL(10,2) DEFAULT 0,
      preco_anota DECIMAL(10,2) DEFAULT 0,
      qp INTEGER DEFAULT 0,
      qg INTEGER DEFAULT 0,
      bebida_id INTEGER,
      brinde_id INTEGER
    )`;

    await sql`CREATE TABLE IF NOT EXISTS fichas (
      id SERIAL PRIMARY KEY,
      produto_id INTEGER NOT NULL,
      tamanho CHAR(1) DEFAULT 'G',
      ingrediente_id INTEGER NOT NULL,
      qtd DECIMAL(10,3) DEFAULT 0
    )`;

    await sql`CREATE TABLE IF NOT EXISTS vendas (
      id SERIAL PRIMARY KEY,
      mes VARCHAR(2) NOT NULL,
      ano VARCHAR(4) NOT NULL,
      cardapio VARCHAR(20) NOT NULL,
      grupos JSONB DEFAULT '[]',
      itens_combo JSONB DEFAULT '[]',
      total_qtd INTEGER DEFAULT 0,
      total_fat DECIMAL(12,2) DEFAULT 0,
      total_custo DECIMAL(12,2) DEFAULT 0
    )`;

    res.status(200).json({ ok: true, message: 'Tabelas criadas!' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};
