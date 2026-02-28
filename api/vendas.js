const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const sql = neon(process.env.DATABASE_URL);

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM vendas ORDER BY ano DESC, mes DESC`;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { mes, ano, cardapio, grupos, massas, extras, detalhes_cmv, total_qtd, total_fat, total_custo } = req.body;
      
      // Deletar existente (upsert)
      await sql`DELETE FROM vendas WHERE mes = ${mes} AND ano = ${ano} AND cardapio = ${cardapio}`;
      
      const [row] = await sql`INSERT INTO vendas 
                              (mes, ano, cardapio, grupos, massas, extras, detalhes_cmv, total_qtd, total_fat, total_custo) 
                              VALUES (
                                ${mes}, ${ano}, ${cardapio}, 
                                ${JSON.stringify(grupos || [])}, 
                                ${JSON.stringify(massas || [])}, 
                                ${JSON.stringify(extras || [])}, 
                                ${JSON.stringify(detalhes_cmv || [])}, 
                                ${total_qtd || 0}, 
                                ${total_fat || 0}, 
                                ${total_custo || 0}
                              ) 
                              RETURNING *`;
      return res.status(200).json(row);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      await sql`DELETE FROM vendas WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
