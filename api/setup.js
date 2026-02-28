const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Produtos - com custo e preço por tamanho
    await sql`CREATE TABLE IF NOT EXISTS produtos (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      cat VARCHAR(50) DEFAULT 'macarrao',
      custo_p DECIMAL(10,2) DEFAULT 0,
      custo_g DECIMAL(10,2) DEFAULT 0,
      preco_p DECIMAL(10,2) DEFAULT 0,
      preco_g DECIMAL(10,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )`;

    // Massas Premium - com custo extra por plataforma
    await sql`CREATE TABLE IF NOT EXISTS massas (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      custo_ifood DECIMAL(10,2) DEFAULT 0,
      custo_anota DECIMAL(10,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )`;

    // Extras - custo de cada extra
    await sql`CREATE TABLE IF NOT EXISTS extras (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      custo DECIMAL(10,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )`;

    // Ingredientes
    await sql`CREATE TABLE IF NOT EXISTS ingredientes (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      un VARCHAR(10) DEFAULT 'kg',
      custo DECIMAL(10,4) DEFAULT 0,
      forn VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    )`;

    // Fichas técnicas
    await sql`CREATE TABLE IF NOT EXISTS fichas (
      id SERIAL PRIMARY KEY,
      produto_id INTEGER REFERENCES produtos(id) ON DELETE CASCADE,
      tamanho CHAR(1) DEFAULT 'G',
      ingrediente_id INTEGER REFERENCES ingredientes(id) ON DELETE CASCADE,
      qtd DECIMAL(10,4) DEFAULT 0,
      un VARCHAR(10) DEFAULT 'g',
      created_at TIMESTAMP DEFAULT NOW()
    )`;

    // Vendas/Importações
    await sql`CREATE TABLE IF NOT EXISTS vendas (
      id SERIAL PRIMARY KEY,
      mes VARCHAR(2) NOT NULL,
      ano VARCHAR(4) NOT NULL,
      cardapio VARCHAR(20) NOT NULL,
      grupos JSONB,
      massas JSONB,
      extras JSONB,
      detalhes_cmv JSONB,
      total_qtd INTEGER DEFAULT 0,
      total_fat DECIMAL(12,2) DEFAULT 0,
      total_custo DECIMAL(12,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(mes, ano, cardapio)
    )`;

    return res.status(200).json({ ok: true, message: 'Tabelas criadas/atualizadas!' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};
