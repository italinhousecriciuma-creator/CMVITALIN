import sql from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT f.*, i.nome as ing_nome, i.custo as ing_custo, i.un as ing_un
        FROM fichas f
        LEFT JOIN ingredientes i ON f.ingrediente_id = i.id
        ORDER BY f.produto_id, f.tamanho
      `;
      return res.json(rows);
    }

    if (req.method === 'POST') {
      const { produto_id, tamanho, ingrediente_id, qtd } = req.body;
      
      // Verifica se já existe
      const existing = await sql`
        SELECT * FROM fichas 
        WHERE produto_id = ${produto_id} AND tamanho = ${tamanho} AND ingrediente_id = ${ingrediente_id}
      `;
      
      if (existing.length > 0) {
        // Atualiza quantidade
        const [row] = await sql`
          UPDATE fichas 
          SET qtd = qtd + ${qtd}
          WHERE id = ${existing[0].id}
          RETURNING *
        `;
        return res.json(row);
      }
      
      const [row] = await sql`
        INSERT INTO fichas (produto_id, tamanho, ingrediente_id, qtd)
        VALUES (${produto_id}, ${tamanho}, ${ingrediente_id}, ${qtd})
        RETURNING *
      `;
      return res.json(row);
    }

    if (req.method === 'DELETE') {
      const { id, produto_id, tamanho, ingrediente_id } = req.body;
      
      if (id) {
        await sql`DELETE FROM fichas WHERE id = ${id}`;
      } else {
        await sql`DELETE FROM fichas WHERE produto_id = ${produto_id} AND tamanho = ${tamanho} AND ingrediente_id = ${ingrediente_id}`;
      }
      return res.json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
