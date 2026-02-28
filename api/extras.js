const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const sql = neon(process.env.DATABASE_URL);

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM extras ORDER BY nome`;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { nome, custo } = req.body;
      const [row] = await sql`INSERT INTO extras (nome, custo) 
                              VALUES (${nome}, ${custo||0}) 
                              RETURNING *`;
      return res.status(200).json(row);
    }

    if (req.method === 'PUT') {
      const { id, nome, custo } = req.body;
      const [row] = await sql`UPDATE extras 
                              SET nome = ${nome}, custo = ${custo||0}
                              WHERE id = ${id} RETURNING *`;
      return res.status(200).json(row);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      await sql`DELETE FROM extras WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
