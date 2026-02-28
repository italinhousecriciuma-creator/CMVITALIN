const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Massas Premium
    const massas = [
      { nome: 'Talharim', custo_ifood: 0.33, custo_anota: 0.33 },
      { nome: 'Penne Integral', custo_ifood: 3.00, custo_anota: 2.00 },
      { nome: 'Espaguete Grano Duro Proteico', custo_ifood: 5.00, custo_anota: 3.00 },
      { nome: 'Nhoque Recheado de Muçarela', custo_ifood: 2.00, custo_anota: 2.00 },
    ];

    for (const m of massas) {
      await sql`INSERT INTO massas (nome, custo_ifood, custo_anota) 
                VALUES (${m.nome}, ${m.custo_ifood}, ${m.custo_anota})
                ON CONFLICT DO NOTHING`;
    }

    // Extras comuns
    const extras = [
      { nome: 'Extra Bacon', custo: 3.50 },
      { nome: 'Extra Queijo', custo: 4.00 },
      { nome: 'Extra Carne Moída', custo: 6.00 },
      { nome: 'Extra Camarão', custo: 12.00 },
      { nome: 'Extra Frango Desfiado', custo: 5.00 },
      { nome: 'Extra Parmesão', custo: 3.00 },
      { nome: 'Extra Cebola Crispy', custo: 1.50 },
      { nome: 'Extra Alho Granulado', custo: 1.00 },
      { nome: 'Extra Ragu de Costela', custo: 8.00 },
      { nome: 'Extra Quatro Queijos', custo: 5.00 },
      { nome: 'Extra Broccoli', custo: 3.00 },
      { nome: 'Extra Requeijão', custo: 2.50 },
      { nome: 'Extra Cheddar', custo: 4.00 },
      { nome: 'Extra Presunto', custo: 4.00 },
    ];

    for (const e of extras) {
      await sql`INSERT INTO extras (nome, custo) 
                VALUES (${e.nome}, ${e.custo})
                ON CONFLICT DO NOTHING`;
    }

    // Produtos exemplo
    const produtos = [
      { nome: 'Bolonhesa', cat: 'macarrao', custo_p: 8.50, custo_g: 12.00 },
      { nome: 'Cheddar com Bacon', cat: 'macarrao', custo_p: 9.00, custo_g: 13.00 },
      { nome: 'Quatro Queijos', cat: 'macarrao', custo_p: 10.00, custo_g: 14.50 },
      { nome: 'Pomodoro', cat: 'macarrao', custo_p: 6.50, custo_g: 9.50 },
      { nome: 'Broccoli', cat: 'macarrao', custo_p: 8.00, custo_g: 11.50 },
      { nome: 'Camarão Rosé', cat: 'macarrao', custo_p: 15.00, custo_g: 22.00 },
      { nome: 'Ragu de Costela', cat: 'macarrao', custo_p: 12.00, custo_g: 18.00 },
      { nome: 'Frango com Requeijão', cat: 'macarrao', custo_p: 9.00, custo_g: 13.00 },
      { nome: 'Risoto Ragu de Costela', cat: 'risoto', custo_p: 0, custo_g: 20.00 },
      { nome: 'Risoto Quatro Queijos', cat: 'risoto', custo_p: 0, custo_g: 16.00 },
      { nome: 'Risoto Camarão', cat: 'risoto', custo_p: 0, custo_g: 24.00 },
      { nome: 'Nhoque Bolonhesa', cat: 'nhoque', custo_p: 0, custo_g: 14.00 },
      { nome: 'Nhoque Quatro Queijos', cat: 'nhoque', custo_p: 0, custo_g: 15.00 },
      { nome: 'Nhoque Ragu de Costela', cat: 'nhoque', custo_p: 0, custo_g: 19.00 },
    ];

    for (const p of produtos) {
      await sql`INSERT INTO produtos (nome, cat, custo_p, custo_g) 
                VALUES (${p.nome}, ${p.cat}, ${p.custo_p}, ${p.custo_g})
                ON CONFLICT DO NOTHING`;
    }

    return res.status(200).json({ ok: true, message: 'Dados iniciais carregados!' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};
