import sql from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM combos ORDER BY nome`;
      return res.json(rows);
    }

    if (req.method === 'POST') {
      const { nome, preco_ifood, preco_anota, qp, qg, bebida_id, brinde_id } = req.body;
      const [row] = await sql`
        INSERT INTO combos (nome, preco_ifood, preco_anota, qp, qg, bebida_id, brinde_id)
        VALUES (${nome}, ${preco_ifood || 0}, ${preco_anota || 0}, ${qp || 0}, ${qg || 0}, ${bebida_id}, ${brinde_id})
        RETURNING *
      `;
      return res.json(row);
    }

    if (req.method === 'PUT') {
      const { id, nome, preco_ifood, preco_anota, qp, qg, bebida_id, brinde_id } = req.body;
      const [row] = await sql`
        UPDATE combos 
        SET nome = ${nome}, preco_ifood = ${preco_ifood || 0}, preco_anota = ${preco_anota || 0}, 
            qp = ${qp || 0}, qg = ${qg || 0}, bebida_id = ${bebida_id}, brinde_id = ${brinde_id}
        WHERE id = ${id}
        RETURNING *
      `;
      return res.json(row);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      await sql`DELETE FROM combos WHERE id = ${id}`;
      return res.json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
