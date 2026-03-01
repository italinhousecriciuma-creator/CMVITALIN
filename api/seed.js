const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Ingredientes exemplo (incluindo embalagens)
    const ingredientes = [
      { nome: 'Carne Moída', un: 'kg', custo: 28.90 },
      { nome: 'Molho de Tomate', un: 'kg', custo: 8.50 },
      { nome: 'Queijo Muçarela', un: 'kg', custo: 45.00 },
      { nome: 'Queijo Parmesão', un: 'kg', custo: 89.00 },
      { nome: 'Queijo Gorgonzola', un: 'kg', custo: 75.00 },
      { nome: 'Queijo Provolone', un: 'kg', custo: 55.00 },
      { nome: 'Creme de Leite', un: 'L', custo: 12.00 },
      { nome: 'Bacon', un: 'kg', custo: 42.00 },
      { nome: 'Cheddar', un: 'kg', custo: 38.00 },
      { nome: 'Brócolis', un: 'kg', custo: 15.00 },
      { nome: 'Frango Desfiado', un: 'kg', custo: 32.00 },
      { nome: 'Camarão', un: 'kg', custo: 85.00 },
      { nome: 'Costela Desfiada', un: 'kg', custo: 48.00 },
      { nome: 'Cogumelo Funghi', un: 'kg', custo: 120.00 },
      { nome: 'Requeijão', un: 'kg', custo: 22.00 },
      { nome: 'Presunto', un: 'kg', custo: 35.00 },
      { nome: 'Massa Penne', un: 'kg', custo: 8.50 },
      { nome: 'Arroz Arbóreo', un: 'kg', custo: 25.00 },
      { nome: 'Nhoque Tradicional', un: 'kg', custo: 18.00 },
      { nome: 'Cebola', un: 'kg', custo: 5.50 },
      { nome: 'Alho', un: 'kg', custo: 35.00 },
      { nome: 'Azeite', un: 'L', custo: 45.00 },
      { nome: 'Temperos', un: 'kg', custo: 25.00 },
      // Embalagens
      { nome: 'Embalagem Box G', un: 'un', custo: 1.80 },
      { nome: 'Embalagem Box P', un: 'un', custo: 1.40 },
      { nome: 'Tampa Box', un: 'un', custo: 0.35 },
      { nome: 'Sacola', un: 'un', custo: 0.25 },
      { nome: 'Talher Descartável', un: 'un', custo: 0.15 },
    ];

    for (const i of ingredientes) {
      await sql`INSERT INTO ingredientes (nome, un, custo) 
                VALUES (${i.nome}, ${i.un}, ${i.custo})
                ON CONFLICT DO NOTHING`;
    }

    // Produtos baseados na planilha real (custo, preço iFood, preço AnotaAi)
    const produtos = [
      // Macarrões G
      { nome: 'Pomodoro', cat: 'macarrao', tam: 'G', custo: 8.23, preco_ifood: 39.90, preco_anota: 29.90 },
      { nome: 'Bolonhesa', cat: 'macarrao', tam: 'G', custo: 10.59, preco_ifood: 48.90, preco_anota: 42.90 },
      { nome: 'Broccoli', cat: 'macarrao', tam: 'G', custo: 9.94, preco_ifood: 49.90, preco_anota: 42.90 },
      { nome: 'Cheddar com Bacon', cat: 'macarrao', tam: 'G', custo: 12.79, preco_ifood: 56.90, preco_anota: 49.90 },
      { nome: 'Parisiense', cat: 'macarrao', tam: 'G', custo: 12.13, preco_ifood: 49.90, preco_anota: 42.90 },
      { nome: 'Quatro Queijos', cat: 'macarrao', tam: 'G', custo: 13.93, preco_ifood: 56.90, preco_anota: 48.90 },
      { nome: 'Camarão Rosé', cat: 'macarrao', tam: 'G', custo: 20.11, preco_ifood: 69.90, preco_anota: 59.90 },
      { nome: 'Funghi', cat: 'macarrao', tam: 'G', custo: 10.63, preco_ifood: 44.90, preco_anota: 39.90 },
      { nome: 'Ragu de Costela', cat: 'macarrao', tam: 'G', custo: 13.24, preco_ifood: 54.90, preco_anota: 49.90 },
      { nome: 'Cheddar com Carne e Bacon', cat: 'macarrao', tam: 'G', custo: 15.15, preco_ifood: 59.90, preco_anota: 54.90 },
      { nome: 'Frango com Requeijão', cat: 'macarrao', tam: 'G', custo: 11.94, preco_ifood: 59.90, preco_anota: 54.90 },
      
      // Macarrões P
      { nome: 'Pomodoro', cat: 'macarrao', tam: 'P', custo: 4.95, preco_ifood: 24.90, preco_anota: 23.90 },
      { nome: 'Bolonhesa', cat: 'macarrao', tam: 'P', custo: 6.15, preco_ifood: 34.90, preco_anota: 29.90 },
      { nome: 'Broccoli', cat: 'macarrao', tam: 'P', custo: 7.28, preco_ifood: 39.90, preco_anota: 32.90 },
      { nome: 'Cheddar com Bacon', cat: 'macarrao', tam: 'P', custo: 8.70, preco_ifood: 43.90, preco_anota: 36.90 },
      { nome: 'Parisiense', cat: 'macarrao', tam: 'P', custo: 8.39, preco_ifood: 39.90, preco_anota: 34.90 },
      { nome: 'Quatro Queijos', cat: 'macarrao', tam: 'P', custo: 9.46, preco_ifood: 43.90, preco_anota: 35.90 },
      { nome: 'Camarão Rosé', cat: 'macarrao', tam: 'P', custo: 10.96, preco_ifood: 49.90, preco_anota: 43.90 },
      { nome: 'Funghi', cat: 'macarrao', tam: 'P', custo: 6.18, preco_ifood: 34.90, preco_anota: 29.90 },
      { nome: 'Ragu de Costela', cat: 'macarrao', tam: 'P', custo: 7.49, preco_ifood: 47.90, preco_anota: 39.90 },
      { nome: 'Cheddar com Carne e Bacon', cat: 'macarrao', tam: 'P', custo: 10.96, preco_ifood: 47.90, preco_anota: 39.90 },
      { nome: 'Frango com Requeijão', cat: 'macarrao', tam: 'P', custo: 9.54, preco_ifood: 47.90, preco_anota: 39.90 },
      
      // Risotos G
      { nome: 'Risoto Quatro Queijos', cat: 'risoto', tam: 'G', custo: 13.28, preco_ifood: 49.90, preco_anota: 44.90 },
      { nome: 'Risoto Ragu de Costela', cat: 'risoto', tam: 'G', custo: 13.26, preco_ifood: 59.90, preco_anota: 49.90 },
      { nome: 'Risoto Camarão', cat: 'risoto', tam: 'G', custo: 19.22, preco_ifood: 69.90, preco_anota: 59.90 },
      { nome: 'Risoto Funghi', cat: 'risoto', tam: 'G', custo: 11.43, preco_ifood: 44.90, preco_anota: 39.90 },
      
      // Nhoques G
      { nome: 'Nhoque Pomodoro', cat: 'nhoque', tam: 'G', custo: 12.43, preco_ifood: 49.90, preco_anota: 37.90 },
      { nome: 'Nhoque Bolonhesa', cat: 'nhoque', tam: 'G', custo: 14.79, preco_ifood: 58.90, preco_anota: 50.90 },
      { nome: 'Nhoque Broccoli', cat: 'nhoque', tam: 'G', custo: 14.14, preco_ifood: 59.90, preco_anota: 50.90 },
      { nome: 'Nhoque Quatro Queijos', cat: 'nhoque', tam: 'G', custo: 18.13, preco_ifood: 66.90, preco_anota: 56.90 },
      { nome: 'Nhoque Cheddar com Bacon', cat: 'nhoque', tam: 'G', custo: 17.43, preco_ifood: 66.90, preco_anota: 57.90 },
      { nome: 'Nhoque Ragu de Costela', cat: 'nhoque', tam: 'G', custo: 17.43, preco_ifood: 64.90, preco_anota: 57.90 },
      { nome: 'Nhoque Camarão', cat: 'nhoque', tam: 'G', custo: 24.31, preco_ifood: 79.90, preco_anota: 67.90 },
      { nome: 'Nhoque Funghi', cat: 'nhoque', tam: 'G', custo: 14.83, preco_ifood: 54.90, preco_anota: 47.90 },
      { nome: 'Nhoque Parisiense', cat: 'nhoque', tam: 'G', custo: 16.33, preco_ifood: 59.90, preco_anota: 50.90 },
      { nome: 'Nhoque Frango com Requeijão', cat: 'nhoque', tam: 'G', custo: 16.14, preco_ifood: 69.90, preco_anota: 62.90 },
      
      // Outros
      { nome: 'Polenta Ragu de Costela', cat: 'outros', tam: 'G', custo: 5.45, preco_ifood: 28.90, preco_anota: 23.90 },
    ];

    for (const p of produtos) {
      await sql`INSERT INTO produtos (nome, cat, tam, custo, preco_ifood, preco_anota) 
                VALUES (${p.nome}, ${p.cat}, ${p.tam}, ${p.custo}, ${p.preco_ifood}, ${p.preco_anota})
                ON CONFLICT DO NOTHING`;
    }

    return res.status(200).json({ ok: true, message: 'Dados carregados!' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};
