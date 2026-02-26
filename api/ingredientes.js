import sql from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM ingredientes ORDER BY nome`;
      return res.json(rows);
    }

    if (req.method === 'POST') {
      const { nome, un, custo, forn } = req.body;
      const [row] = await sql`
        INSERT INTO ingredientes (nome, un, custo, forn)
        VALUES (${nome}, ${un}, ${custo || 0}, ${forn || ''})
        RETURNING *
      `;
      return res.json(row);
    }

    if (req.method === 'PUT') {
      const { id, nome, un, custo, forn } = req.body;
      const [row] = await sql`
        UPDATE ingredientes 
        SET nome = ${nome}, un = ${un}, custo = ${custo || 0}, forn = ${forn || ''}
        WHERE id = ${id}
        RETURNING *
      `;
      return res.json(row);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      await sql`DELETE FROM ingredientes WHERE id = ${id}`;
      return res.json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
