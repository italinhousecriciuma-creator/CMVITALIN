const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Limpar tabelas
    await sql`DELETE FROM massas`;
    await sql`DELETE FROM extras`;
    await sql`DELETE FROM bebidas`;
    await sql`DELETE FROM brindes`;
    await sql`DELETE FROM produtos`;
    await sql`DELETE FROM combos`;

    // Massas
    await sql`INSERT INTO massas (nome, custo_p, custo_g) VALUES ('Talharim', 2.5, 4.5), ('Penne', 2.3, 4.2), ('Caracolino', 2.4, 4.3), ('Espaguete Proteico', 5, 8), ('Penne Integral', 3, 5.5), ('Nhoque Tradicional', 3.5, 6), ('Nhoque Recheado', 4.5, 7.5)`;

    // Extras
    await sql`INSERT INTO extras (nome, preco, custo) VALUES ('Extra Bacon', 5.9, 2.5), ('Extra Queijo', 5.7, 2), ('Extra Parmesão', 5.7, 3), ('Extra Carne Moída', 11.7, 5), ('Extra Camarão', 19, 10), ('Extra Frango', 8, 3.5), ('Extra Broccoli', 7, 2.5)`;

    // Bebidas
    await sql`INSERT INTO bebidas (nome, preco, custo) VALUES ('Coca Lata 350ml', 8, 3.5), ('Coca Zero Lata', 8, 3.5), ('Sprite Lata', 8, 3.5), ('Coca 600ml', 10, 5), ('Água', 5, 1.5), ('Suco Del Valle', 8, 3.5), ('Vinho 750ml', 49.9, 25)`;

    // Brindes
    await sql`INSERT INTO brindes (nome) VALUES ('Copo Torre de Pisa'), ('Copo Coliseu'), ('Copo Vaticano')`;

    // Produtos
    await sql`INSERT INTO produtos (nome, cat, ifood_p, ifood_g, anota_p, anota_g) VALUES 
      ('Bolonhesa', 'macarrao', 39.5, 48.6, 35, 44),
      ('Broccoli', 'macarrao', 43, 47.3, 38, 43),
      ('Ragu de Costela', 'macarrao', 50.7, 55, 46, 50),
      ('Quatro Queijos', 'macarrao', 47.4, 54.7, 43, 50),
      ('Cheddar Bacon', 'macarrao', 47.3, 55.5, 43, 50),
      ('Camarão Rosé', 'macarrao', 56.5, 72.6, 52, 68),
      ('Risoto Ragu', 'risoto', 0, 58.1, 0, 53),
      ('Risoto Camarão', 'risoto', 0, 70.4, 0, 65),
      ('Nhoque 4 Queijos', 'nhoque', 0, 64.6, 0, 60),
      ('Tiramisu', 'sobremesa', 18.8, 0, 16, 0)`;

    // Combos
    await sql`INSERT INTO combos (nome, preco_ifood, preco_anota, qp, qg, bebida_id, brinde_id) VALUES ('Combo Grande', 63.5, 58, 0, 1, 1, null), ('Combo Casal', 120.7, 110, 0, 2, 4, null)`;

    res.status(200).json({ ok: true, message: 'Dados iniciais inseridos!' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
