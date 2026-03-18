const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { route } = req.query;
  
  try {
    const sql = neon(process.env.DATABASE_URL);

    // ==================== SETUP ====================
    if (route === 'setup') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      
      const { action } = req.body || {};
      
      if (action === 'clear') {
        await sql`DROP TABLE IF EXISTS fichas CASCADE`;
        await sql`DROP TABLE IF EXISTS vendas CASCADE`;
        await sql`DROP TABLE IF EXISTS ingredientes CASCADE`;
        await sql`DROP TABLE IF EXISTS produtos CASCADE`;
        await sql`DROP TABLE IF EXISTS bebidas CASCADE`;
        await sql`DROP TABLE IF EXISTS sobremesas CASCADE`;
        await sql`DROP TABLE IF EXISTS extras CASCADE`;
        return res.status(200).json({ ok: true, message: 'Banco limpo!' });
      }

      await sql`CREATE TABLE IF NOT EXISTS produtos (
        id SERIAL PRIMARY KEY, nome VARCHAR(255) NOT NULL, cat VARCHAR(50) DEFAULT 'macarrao',
        tam CHAR(1) DEFAULT 'G', custo DECIMAL(10,2) DEFAULT 0,
        preco_ifood DECIMAL(10,2) DEFAULT 0, preco_anota DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )`;
      
      await sql`CREATE TABLE IF NOT EXISTS bebidas (
        id SERIAL PRIMARY KEY, nome VARCHAR(255) NOT NULL, custo DECIMAL(10,2) DEFAULT 0,
        preco_ifood DECIMAL(10,2) DEFAULT 0, preco_anota DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )`;
      
      await sql`CREATE TABLE IF NOT EXISTS sobremesas (
        id SERIAL PRIMARY KEY, nome VARCHAR(255) NOT NULL, custo DECIMAL(10,2) DEFAULT 0,
        preco_ifood DECIMAL(10,2) DEFAULT 0, preco_anota DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )`;
      
      await sql`CREATE TABLE IF NOT EXISTS extras (
        id SERIAL PRIMARY KEY, nome VARCHAR(255) NOT NULL, custo DECIMAL(10,2) DEFAULT 0,
        preco DECIMAL(10,2) DEFAULT 0, created_at TIMESTAMP DEFAULT NOW()
      )`;

      await sql`CREATE TABLE IF NOT EXISTS ingredientes (
        id SERIAL PRIMARY KEY, nome VARCHAR(255) NOT NULL, un VARCHAR(10) DEFAULT 'kg',
        custo DECIMAL(10,4) DEFAULT 0, forn VARCHAR(255), created_at TIMESTAMP DEFAULT NOW()
      )`;

      await sql`CREATE TABLE IF NOT EXISTS fichas (
        id SERIAL PRIMARY KEY, produto_id INTEGER REFERENCES produtos(id) ON DELETE CASCADE,
        ingrediente_id INTEGER REFERENCES ingredientes(id) ON DELETE CASCADE,
        qtd DECIMAL(10,4) DEFAULT 0, un VARCHAR(10) DEFAULT 'g', created_at TIMESTAMP DEFAULT NOW()
      )`;

      await sql`CREATE TABLE IF NOT EXISTS vendas (
        id SERIAL PRIMARY KEY, mes VARCHAR(2) NOT NULL, ano VARCHAR(4) NOT NULL,
        cardapio VARCHAR(20) NOT NULL, itens JSONB, total_qtd INTEGER DEFAULT 0,
        total_fat DECIMAL(12,2) DEFAULT 0, total_custo DECIMAL(12,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )`;

      return res.status(200).json({ ok: true, message: 'Tabelas criadas!' });
    }

    // ==================== SEED ====================
    if (route === 'seed') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

      const ingredientes = [
        { nome: 'Carne Moída', un: 'kg', custo: 28.90 },
        { nome: 'Molho de Tomate', un: 'kg', custo: 8.50 },
        { nome: 'Queijo Muçarela', un: 'kg', custo: 45.00 },
        { nome: 'Queijo Parmesão', un: 'kg', custo: 89.00 },
        { nome: 'Queijo Gorgonzola', un: 'kg', custo: 75.00 },
        { nome: 'Creme de Leite', un: 'L', custo: 12.00 },
        { nome: 'Bacon', un: 'kg', custo: 42.00 },
        { nome: 'Cheddar', un: 'kg', custo: 38.00 },
        { nome: 'Brócolis', un: 'kg', custo: 15.00 },
        { nome: 'Frango Desfiado', un: 'kg', custo: 32.00 },
        { nome: 'Camarão', un: 'kg', custo: 85.00 },
        { nome: 'Costela Desfiada', un: 'kg', custo: 48.00 },
        { nome: 'Cogumelo Funghi', un: 'kg', custo: 120.00 },
        { nome: 'Requeijão', un: 'kg', custo: 22.00 },
        { nome: 'Massa Penne', un: 'kg', custo: 8.50 },
        { nome: 'Arroz Arbóreo', un: 'kg', custo: 25.00 },
        { nome: 'Nhoque Fresco', un: 'kg', custo: 18.00 },
        { nome: 'Embalagem Box G', un: 'un', custo: 1.80 },
        { nome: 'Embalagem Box P', un: 'un', custo: 1.40 },
        { nome: 'Tampa', un: 'un', custo: 0.35 },
        { nome: 'Sacola', un: 'un', custo: 0.25 },
      ];

      for (const i of ingredientes) {
        await sql`INSERT INTO ingredientes (nome, un, custo) VALUES (${i.nome}, ${i.un}, ${i.custo}) ON CONFLICT DO NOTHING`;
      }

      const produtos = [
        { nome: 'Pomodoro', cat: 'macarrao', tam: 'G', custo: 0, preco_ifood: 39.90, preco_anota: 29.90 },
        { nome: 'Bolonhesa', cat: 'macarrao', tam: 'G', custo: 0, preco_ifood: 48.90, preco_anota: 42.90 },
        { nome: 'Broccoli', cat: 'macarrao', tam: 'G', custo: 0, preco_ifood: 49.90, preco_anota: 42.90 },
        { nome: 'Cheddar com Bacon', cat: 'macarrao', tam: 'G', custo: 0, preco_ifood: 56.90, preco_anota: 49.90 },
        { nome: 'Parisiense', cat: 'macarrao', tam: 'G', custo: 0, preco_ifood: 49.90, preco_anota: 42.90 },
        { nome: 'Quatro Queijos', cat: 'macarrao', tam: 'G', custo: 0, preco_ifood: 56.90, preco_anota: 48.90 },
        { nome: 'Camarão Rosé', cat: 'macarrao', tam: 'G', custo: 0, preco_ifood: 69.90, preco_anota: 59.90 },
        { nome: 'Funghi', cat: 'macarrao', tam: 'G', custo: 0, preco_ifood: 44.90, preco_anota: 39.90 },
        { nome: 'Ragu de Costela', cat: 'macarrao', tam: 'G', custo: 0, preco_ifood: 54.90, preco_anota: 49.90 },
        { nome: 'Cheddar com Carne e Bacon', cat: 'macarrao', tam: 'G', custo: 0, preco_ifood: 59.90, preco_anota: 54.90 },
        { nome: 'Frango com Requeijão', cat: 'macarrao', tam: 'G', custo: 0, preco_ifood: 59.90, preco_anota: 54.90 },
        { nome: 'Pomodoro', cat: 'macarrao', tam: 'P', custo: 0, preco_ifood: 24.90, preco_anota: 23.90 },
        { nome: 'Bolonhesa', cat: 'macarrao', tam: 'P', custo: 0, preco_ifood: 34.90, preco_anota: 29.90 },
        { nome: 'Broccoli', cat: 'macarrao', tam: 'P', custo: 0, preco_ifood: 39.90, preco_anota: 32.90 },
        { nome: 'Cheddar com Bacon', cat: 'macarrao', tam: 'P', custo: 0, preco_ifood: 43.90, preco_anota: 36.90 },
        { nome: 'Quatro Queijos', cat: 'macarrao', tam: 'P', custo: 0, preco_ifood: 43.90, preco_anota: 35.90 },
        { nome: 'Camarão Rosé', cat: 'macarrao', tam: 'P', custo: 0, preco_ifood: 49.90, preco_anota: 43.90 },
        { nome: 'Ragu de Costela', cat: 'macarrao', tam: 'P', custo: 0, preco_ifood: 47.90, preco_anota: 39.90 },
        { nome: 'Risoto Quatro Queijos', cat: 'risoto', tam: 'G', custo: 0, preco_ifood: 49.90, preco_anota: 44.90 },
        { nome: 'Risoto Ragu de Costela', cat: 'risoto', tam: 'G', custo: 0, preco_ifood: 59.90, preco_anota: 49.90 },
        { nome: 'Risoto Camarão', cat: 'risoto', tam: 'G', custo: 0, preco_ifood: 69.90, preco_anota: 59.90 },
        { nome: 'Risoto Funghi', cat: 'risoto', tam: 'G', custo: 0, preco_ifood: 44.90, preco_anota: 39.90 },
        { nome: 'Nhoque Pomodoro', cat: 'nhoque', tam: 'G', custo: 0, preco_ifood: 49.90, preco_anota: 37.90 },
        { nome: 'Nhoque Bolonhesa', cat: 'nhoque', tam: 'G', custo: 0, preco_ifood: 58.90, preco_anota: 50.90 },
        { nome: 'Nhoque Quatro Queijos', cat: 'nhoque', tam: 'G', custo: 0, preco_ifood: 66.90, preco_anota: 56.90 },
        { nome: 'Nhoque Ragu de Costela', cat: 'nhoque', tam: 'G', custo: 0, preco_ifood: 64.90, preco_anota: 57.90 },
        { nome: 'Nhoque Camarão', cat: 'nhoque', tam: 'G', custo: 0, preco_ifood: 79.90, preco_anota: 67.90 },
        { nome: 'Combo Grande', cat: 'combo', tam: 'G', custo: 0, preco_ifood: 63.90, preco_anota: 55.90 },
        { nome: 'Combo Risoto', cat: 'combo', tam: 'G', custo: 0, preco_ifood: 66.90, preco_anota: 58.90 },
        { nome: 'Combo Casal', cat: 'combo', tam: 'G', custo: 0, preco_ifood: 119.90, preco_anota: 105.90 },
      ];

      for (const p of produtos) {
        await sql`INSERT INTO produtos (nome, cat, tam, custo, preco_ifood, preco_anota) VALUES (${p.nome}, ${p.cat}, ${p.tam}, ${p.custo}, ${p.preco_ifood}, ${p.preco_anota}) ON CONFLICT DO NOTHING`;
      }

      const bebidas = [
        { nome: 'Coca-Cola Lata 350ml', custo: 2.80, preco_ifood: 8.00, preco_anota: 7.00 },
        { nome: 'Coca-Cola Zero Lata 350ml', custo: 2.80, preco_ifood: 8.00, preco_anota: 7.00 },
        { nome: 'Coca-Cola 600ml', custo: 4.50, preco_ifood: 10.00, preco_anota: 9.00 },
        { nome: 'Coca-Cola 2L', custo: 8.00, preco_ifood: 19.00, preco_anota: 17.00 },
        { nome: 'Água sem Gás', custo: 1.20, preco_ifood: 5.00, preco_anota: 4.50 },
        { nome: 'Água com Gás', custo: 1.50, preco_ifood: 5.00, preco_anota: 4.50 },
        { nome: 'Suco Del Valle 290ml', custo: 3.00, preco_ifood: 8.00, preco_anota: 7.00 },
        { nome: 'Vinho Badia al Colle', custo: 25.00, preco_ifood: 69.90, preco_anota: 65.00 },
      ];

      for (const b of bebidas) {
        await sql`INSERT INTO bebidas (nome, custo, preco_ifood, preco_anota) VALUES (${b.nome}, ${b.custo}, ${b.preco_ifood}, ${b.preco_anota}) ON CONFLICT DO NOTHING`;
      }

      const sobremesas = [
        { nome: 'Tiramisu 100g', custo: 5.50, preco_ifood: 18.90, preco_anota: 16.90 },
        { nome: 'Brownie 50g', custo: 3.00, preco_ifood: 9.90, preco_anota: 8.90 },
        { nome: 'Cannoli 55g', custo: 3.50, preco_ifood: 11.90, preco_anota: 10.90 },
        { nome: 'Palha Italiana 50g', custo: 3.50, preco_ifood: 11.90, preco_anota: 10.90 },
      ];

      for (const s of sobremesas) {
        await sql`INSERT INTO sobremesas (nome, custo, preco_ifood, preco_anota) VALUES (${s.nome}, ${s.custo}, ${s.preco_ifood}, ${s.preco_anota}) ON CONFLICT DO NOTHING`;
      }

      const extras = [
        { nome: 'Extra Bacon 25g', custo: 1.50, preco: 6.00 },
        { nome: 'Extra Queijo 45g', custo: 2.00, preco: 6.00 },
        { nome: 'Extra Parmesão 15g', custo: 1.80, preco: 6.00 },
        { nome: 'Extra Frango Desfiado', custo: 3.00, preco: 8.00 },
        { nome: 'Extra Camarão', custo: 8.00, preco: 20.00 },
        { nome: 'Extra Carne Moída', custo: 4.00, preco: 10.00 },
        { nome: 'Extra Ragu de Costela', custo: 5.00, preco: 16.00 },
      ];

      for (const e of extras) {
        await sql`INSERT INTO extras (nome, custo, preco) VALUES (${e.nome}, ${e.custo}, ${e.preco}) ON CONFLICT DO NOTHING`;
      }

      return res.status(200).json({ ok: true, message: 'Dados carregados!' });
    }

    // ==================== PRODUTOS ====================
    if (route === 'produtos') {
      if (req.method === 'GET') {
        const rows = await sql`SELECT * FROM produtos ORDER BY cat, tam, nome`;
        return res.status(200).json(rows);
      }
      if (req.method === 'POST') {
        const { nome, cat, tam, custo, preco_ifood, preco_anota } = req.body;
        const [row] = await sql`INSERT INTO produtos (nome, cat, tam, custo, preco_ifood, preco_anota) VALUES (${nome}, ${cat||'macarrao'}, ${tam||'G'}, ${custo||0}, ${preco_ifood||0}, ${preco_anota||0}) RETURNING *`;
        return res.status(200).json(row);
      }
      if (req.method === 'PUT') {
        const { id, nome, cat, tam, custo, preco_ifood, preco_anota } = req.body;
        const [row] = await sql`UPDATE produtos SET nome=${nome}, cat=${cat}, tam=${tam}, custo=${custo||0}, preco_ifood=${preco_ifood||0}, preco_anota=${preco_anota||0} WHERE id=${id} RETURNING *`;
        return res.status(200).json(row);
      }
      if (req.method === 'DELETE') {
        await sql`DELETE FROM produtos WHERE id=${req.body.id}`;
        return res.status(200).json({ ok: true });
      }
    }

    // ==================== BEBIDAS ====================
    if (route === 'bebidas') {
      if (req.method === 'GET') {
        const rows = await sql`SELECT * FROM bebidas ORDER BY nome`;
        return res.status(200).json(rows);
      }
      if (req.method === 'POST') {
        const { nome, custo, preco_ifood, preco_anota } = req.body;
        const [row] = await sql`INSERT INTO bebidas (nome, custo, preco_ifood, preco_anota) VALUES (${nome}, ${custo||0}, ${preco_ifood||0}, ${preco_anota||0}) RETURNING *`;
        return res.status(200).json(row);
      }
      if (req.method === 'PUT') {
        const { id, nome, custo, preco_ifood, preco_anota } = req.body;
        const [row] = await sql`UPDATE bebidas SET nome=${nome}, custo=${custo||0}, preco_ifood=${preco_ifood||0}, preco_anota=${preco_anota||0} WHERE id=${id} RETURNING *`;
        return res.status(200).json(row);
      }
      if (req.method === 'DELETE') {
        await sql`DELETE FROM bebidas WHERE id=${req.body.id}`;
        return res.status(200).json({ ok: true });
      }
    }

    // ==================== SOBREMESAS ====================
    if (route === 'sobremesas') {
      if (req.method === 'GET') {
        const rows = await sql`SELECT * FROM sobremesas ORDER BY nome`;
        return res.status(200).json(rows);
      }
      if (req.method === 'POST') {
        const { nome, custo, preco_ifood, preco_anota } = req.body;
        const [row] = await sql`INSERT INTO sobremesas (nome, custo, preco_ifood, preco_anota) VALUES (${nome}, ${custo||0}, ${preco_ifood||0}, ${preco_anota||0}) RETURNING *`;
        return res.status(200).json(row);
      }
      if (req.method === 'PUT') {
        const { id, nome, custo, preco_ifood, preco_anota } = req.body;
        const [row] = await sql`UPDATE sobremesas SET nome=${nome}, custo=${custo||0}, preco_ifood=${preco_ifood||0}, preco_anota=${preco_anota||0} WHERE id=${id} RETURNING *`;
        return res.status(200).json(row);
      }
      if (req.method === 'DELETE') {
        await sql`DELETE FROM sobremesas WHERE id=${req.body.id}`;
        return res.status(200).json({ ok: true });
      }
    }

    // ==================== EXTRAS ====================
    if (route === 'extras') {
      if (req.method === 'GET') {
        const rows = await sql`SELECT * FROM extras ORDER BY nome`;
        return res.status(200).json(rows);
      }
      if (req.method === 'POST') {
        const { nome, custo, preco } = req.body;
        const [row] = await sql`INSERT INTO extras (nome, custo, preco) VALUES (${nome}, ${custo||0}, ${preco||0}) RETURNING *`;
        return res.status(200).json(row);
      }
      if (req.method === 'PUT') {
        const { id, nome, custo, preco } = req.body;
        const [row] = await sql`UPDATE extras SET nome=${nome}, custo=${custo||0}, preco=${preco||0} WHERE id=${id} RETURNING *`;
        return res.status(200).json(row);
      }
      if (req.method === 'DELETE') {
        await sql`DELETE FROM extras WHERE id=${req.body.id}`;
        return res.status(200).json({ ok: true });
      }
    }

    // ==================== INGREDIENTES ====================
    if (route === 'ingredientes') {
      if (req.method === 'GET') {
        const rows = await sql`SELECT * FROM ingredientes ORDER BY nome`;
        return res.status(200).json(rows);
      }
      if (req.method === 'POST') {
        const { nome, un, custo, forn } = req.body;
        const [row] = await sql`INSERT INTO ingredientes (nome, un, custo, forn) VALUES (${nome}, ${un||'kg'}, ${custo||0}, ${forn||''}) RETURNING *`;
        return res.status(200).json(row);
      }
      if (req.method === 'PUT') {
        const { id, nome, un, custo, forn } = req.body;
        const [row] = await sql`UPDATE ingredientes SET nome=${nome}, un=${un}, custo=${custo||0}, forn=${forn||''} WHERE id=${id} RETURNING *`;
        return res.status(200).json(row);
      }
      if (req.method === 'DELETE') {
        await sql`DELETE FROM ingredientes WHERE id=${req.body.id}`;
        return res.status(200).json({ ok: true });
      }
    }

    // ==================== FICHAS ====================
    if (route === 'fichas') {
      if (req.method === 'GET') {
        const rows = await sql`SELECT * FROM fichas ORDER BY id`;
        return res.status(200).json(rows);
      }
      if (req.method === 'POST') {
        const { produto_id, ingrediente_id, qtd, un } = req.body;
        const [row] = await sql`INSERT INTO fichas (produto_id, ingrediente_id, qtd, un) VALUES (${produto_id}, ${ingrediente_id}, ${qtd||0}, ${un||'g'}) RETURNING *`;
        return res.status(200).json(row);
      }
      if (req.method === 'DELETE') {
        await sql`DELETE FROM fichas WHERE id=${req.body.id}`;
        return res.status(200).json({ ok: true });
      }
    }

    // ==================== VENDAS ====================
    if (route === 'vendas') {
      if (req.method === 'GET') {
        const rows = await sql`SELECT * FROM vendas ORDER BY ano DESC, mes DESC`;
        return res.status(200).json(rows);
      }
      if (req.method === 'POST') {
        const { mes, ano, cardapio, itens, total_qtd, total_fat, total_custo } = req.body;
        const [row] = await sql`INSERT INTO vendas (mes, ano, cardapio, itens, total_qtd, total_fat, total_custo) VALUES (${mes}, ${ano}, ${cardapio}, ${JSON.stringify(itens)}, ${total_qtd||0}, ${total_fat||0}, ${total_custo||0}) RETURNING *`;
        return res.status(200).json(row);
      }
      if (req.method === 'DELETE') {
        await sql`DELETE FROM vendas WHERE id=${req.body.id}`;
        return res.status(200).json({ ok: true });
      }
    }

    return res.status(404).json({ error: 'Rota não encontrada: ' + route });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};
