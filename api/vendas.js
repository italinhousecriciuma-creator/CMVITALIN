import sql from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM vendas ORDER BY ano DESC, mes DESC`;
      return res.json(rows);
    }

    if (req.method === 'POST') {
      const { mes, ano, cardapio, grupos, itens_combo, total_qtd, total_fat, total_custo } = req.body;
      
      // Remove existente se houver
      await sql`DELETE FROM vendas WHERE mes = ${mes} AND ano = ${ano} AND cardapio = ${cardapio}`;
      
      const [row] = await sql`
        INSERT INTO vendas (mes, ano, cardapio, grupos, itens_combo, total_qtd, total_fat, total_custo)
        VALUES (${mes}, ${ano}, ${cardapio}, ${JSON.stringify(grupos)}, ${JSON.stringify(itens_combo)}, ${total_qtd || 0}, ${total_fat || 0}, ${total_custo || 0})
        RETURNING *
      `;
      return res.json(row);
    }

    if (req.method === 'DELETE') {
      const { id, mes, ano, cardapio } = req.body;
      
      if (id) {
        await sql`DELETE FROM vendas WHERE id = ${id}`;
      } else {
        await sql`DELETE FROM vendas WHERE mes = ${mes} AND ano = ${ano} AND cardapio = ${cardapio}`;
      }
      return res.json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
