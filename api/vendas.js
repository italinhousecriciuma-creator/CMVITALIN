const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const sql = neon(process.env.DATABASE_URL);

    if (req.method === 'GET') {
      try {
        const rows = await sql`SELECT id, mes, ano, cardapio, itens, total_qtd, total_fat, total_custo, created_at FROM vendas ORDER BY ano DESC, mes DESC, cardapio`;
        return res.status(200).json(rows);
      } catch (e) {
        // Fallback
        const rows = await sql`SELECT * FROM vendas ORDER BY ano DESC, mes DESC`;
        return res.status(200).json(rows.map(r => ({
          ...r,
          itens: r.itens || [],
          total_qtd: r.total_qtd || 0,
          total_fat: r.total_fat || 0,
          total_custo: r.total_custo || 0
        })));
      }
    }

    if (req.method === 'POST') {
      const { mes, ano, cardapio, itens, total_qtd, total_fat, total_custo } = req.body;
      
      // Upsert - deletar existente e inserir novo
      await sql`DELETE FROM vendas WHERE mes = ${mes} AND ano = ${ano} AND cardapio = ${cardapio}`;
      
      const [row] = await sql`INSERT INTO vendas (mes, ano, cardapio, itens, total_qtd, total_fat, total_custo) 
                              VALUES (${mes}, ${ano}, ${cardapio}, ${JSON.stringify(itens || [])}, 
                                      ${total_qtd || 0}, ${total_fat || 0}, ${total_custo || 0}) 
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
    console.error(e);
    if (e.message.includes('column') && e.message.includes('does not exist')) {
      return res.status(500).json({ error: 'Banco desatualizado. Vá em Config → Setup DB para atualizar.' });
    }
    res.status(500).json({ error: e.message });
  }
};
