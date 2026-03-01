const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const sql = neon(process.env.DATABASE_URL);

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM produtos ORDER BY cat, tam, nome`;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { nome, cat, tam, custo, preco_ifood, preco_anota } = req.body;
      const [row] = await sql`INSERT INTO produtos (nome, cat, tam, custo, preco_ifood, preco_anota) 
                              VALUES (${nome}, ${cat || 'macarrao'}, ${tam || 'G'}, ${custo || 0}, ${preco_ifood || 0}, ${preco_anota || 0}) 
                              RETURNING *`;
      return res.status(200).json(row);
    }

    if (req.method === 'PUT') {
      const { id, nome, cat, tam, custo, preco_ifood, preco_anota } = req.body;
      const [row] = await sql`UPDATE produtos 
                              SET nome = ${nome}, cat = ${cat || 'macarrao'}, tam = ${tam || 'G'},
                                  custo = ${custo || 0}, preco_ifood = ${preco_ifood || 0}, preco_anota = ${preco_anota || 0}
                              WHERE id = ${id} RETURNING *`;
      return res.status(200).json(row);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      await sql`DELETE FROM produtos WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
