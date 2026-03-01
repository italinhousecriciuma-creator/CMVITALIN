const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const sql = neon(process.env.DATABASE_URL);
    const { action } = req.body || {};
    
    // Se action = 'clear', limpar todas as tabelas
    if (action === 'clear') {
      await sql`DELETE FROM fichas`;
      await sql`DELETE FROM vendas`;
      await sql`DELETE FROM ingredientes`;
      await sql`DELETE FROM produtos`;
      await sql`DELETE FROM bebidas`;
      await sql`DELETE FROM sobremesas`;
      await sql`DELETE FROM extras`;
      return res.status(200).json({ ok: true, message: 'Banco limpo!' });
    }

    // Produtos
    await sql`CREATE TABLE IF NOT EXISTS produtos (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      cat VARCHAR(50) DEFAULT 'macarrao',
      tam CHAR(1) DEFAULT 'G',
      custo DECIMAL(10,2) DEFAULT 0,
      preco_ifood DECIMAL(10,2) DEFAULT 0,
      preco_anota DECIMAL(10,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )`;
    
    // Migração produtos
    await sql`ALTER TABLE produtos ADD COLUMN IF NOT EXISTS tam CHAR(1) DEFAULT 'G'`;
    await sql`ALTER TABLE produtos ADD COLUMN IF NOT EXISTS custo DECIMAL(10,2) DEFAULT 0`;
    await sql`ALTER TABLE produtos ADD COLUMN IF NOT EXISTS preco_ifood DECIMAL(10,2) DEFAULT 0`;
    await sql`ALTER TABLE produtos ADD COLUMN IF NOT EXISTS preco_anota DECIMAL(10,2) DEFAULT 0`;
    
    // Bebidas
    await sql`CREATE TABLE IF NOT EXISTS bebidas (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      custo DECIMAL(10,2) DEFAULT 0,
      preco_ifood DECIMAL(10,2) DEFAULT 0,
      preco_anota DECIMAL(10,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )`;
    
    // Sobremesas
    await sql`CREATE TABLE IF NOT EXISTS sobremesas (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      custo DECIMAL(10,2) DEFAULT 0,
      preco_ifood DECIMAL(10,2) DEFAULT 0,
      preco_anota DECIMAL(10,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )`;
    
    // Extras
    await sql`CREATE TABLE IF NOT EXISTS extras (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      custo DECIMAL(10,2) DEFAULT 0,
      preco DECIMAL(10,2) DEFAULT 0,
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
      ingrediente_id INTEGER REFERENCES ingredientes(id) ON DELETE CASCADE,
      qtd DECIMAL(10,4) DEFAULT 0,
      un VARCHAR(10) DEFAULT 'g',
      created_at TIMESTAMP DEFAULT NOW()
    )`;
    
    await sql`ALTER TABLE fichas ADD COLUMN IF NOT EXISTS un VARCHAR(10) DEFAULT 'g'`;

    // Vendas
    await sql`CREATE TABLE IF NOT EXISTS vendas (
      id SERIAL PRIMARY KEY,
      mes VARCHAR(2) NOT NULL,
      ano VARCHAR(4) NOT NULL,
      cardapio VARCHAR(20) NOT NULL,
      itens JSONB,
      total_qtd INTEGER DEFAULT 0,
      total_fat DECIMAL(12,2) DEFAULT 0,
      total_custo DECIMAL(12,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )`;
    
    await sql`ALTER TABLE vendas ADD COLUMN IF NOT EXISTS itens JSONB`;

    return res.status(200).json({ ok: true, message: 'Tabelas criadas e migradas!' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};
