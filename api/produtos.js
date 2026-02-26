const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const sql = neon(process.env.DATABASE_URL);

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM produtos ORDER BY nome`;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { nome, cat, ifood_p, ifood_g, anota_p, anota_g } = req.body;
      const [row] = await sql`INSERT INTO produtos (nome, cat, ifood_p, ifood_g, anota_p, anota_g) VALUES (${nome}, ${cat || 'macarrao'}, ${ifood_p || 0}, ${ifood_g || 0}, ${anota_p || 0}, ${anota_g || 0}) RETURNING *`;
      return res.status(200).json(row);
    }

    if (req.method === 'PUT') {
      const { id, nome, cat, ifood_p, ifood_g, anota_p, anota_g } = req.body;
      const [row] = await sql`UPDATE produtos SET nome = ${nome}, cat = ${cat}, ifood_p = ${ifood_p || 0}, ifood_g = ${ifood_g || 0}, anota_p = ${anota_p || 0}, anota_g = ${anota_g || 0} WHERE id = ${id} RETURNING *`;
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
