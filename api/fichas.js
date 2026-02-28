const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const sql = neon(process.env.DATABASE_URL);

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM fichas ORDER BY produto_id, tamanho`;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { produto_id, tamanho, ingrediente_id, qtd, un } = req.body;
      const [row] = await sql`INSERT INTO fichas (produto_id, tamanho, ingrediente_id, qtd, un) 
                              VALUES (${produto_id}, ${tamanho||'G'}, ${ingrediente_id}, ${qtd||0}, ${un||'g'}) 
                              RETURNING *`;
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
