const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const sql = neon(process.env.DATABASE_URL);

    if (req.method === 'GET') {
      const rows = await sql`SELECT f.*, i.nome as ing_nome, i.custo as ing_custo, i.un as ing_un FROM fichas f LEFT JOIN ingredientes i ON f.ingrediente_id = i.id ORDER BY f.produto_id, f.tamanho`;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { produto_id, tamanho, ingrediente_id, qtd } = req.body;
      const existing = await sql`SELECT * FROM fichas WHERE produto_id = ${produto_id} AND tamanho = ${tamanho} AND ingrediente_id = ${ingrediente_id}`;
      
      if (existing.length > 0) {
        const [row] = await sql`UPDATE fichas SET qtd = qtd + ${qtd} WHERE id = ${existing[0].id} RETURNING *`;
        return res.status(200).json(row);
      }
      
      const [row] = await sql`INSERT INTO fichas (produto_id, tamanho, ingrediente_id, qtd) VALUES (${produto_id}, ${tamanho}, ${ingrediente_id}, ${qtd}) RETURNING *`;
      return res.status(200).json(row);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      await sql`DELETE FROM fichas WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
