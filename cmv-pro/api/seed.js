import sql from './_db.js';

const INIT_MASSAS = [
  { nome: "Talharim", custo_p: 2.5, custo_g: 4.5 },
  { nome: "Penne", custo_p: 2.3, custo_g: 4.2 },
  { nome: "Caracolino", custo_p: 2.4, custo_g: 4.3 },
  { nome: "Espaguete Proteico", custo_p: 5, custo_g: 8 },
  { nome: "Penne Integral", custo_p: 3, custo_g: 5.5 },
  { nome: "Nhoque Tradicional", custo_p: 3.5, custo_g: 6 },
  { nome: "Nhoque Recheado", custo_p: 4.5, custo_g: 7.5 }
];

const INIT_EXTRAS = [
  { nome: "Extra Bacon", preco: 5.9, custo: 2.5 },
  { nome: "Extra Queijo", preco: 5.7, custo: 2 },
  { nome: "Extra Parmesão", preco: 5.7, custo: 3 },
  { nome: "Extra Carne Moída", preco: 11.7, custo: 5 },
  { nome: "Extra Camarão", preco: 19, custo: 10 },
  { nome: "Extra Frango", preco: 8, custo: 3.5 },
  { nome: "Extra Broccoli", preco: 7, custo: 2.5 },
  { nome: "Extra Ragu", preco: 16, custo: 7 },
  { nome: "Extra 4 Queijos", preco: 14, custo: 5 },
  { nome: "Extra Alho Frito", preco: 5, custo: 1.5 },
  { nome: "Extra Cebola Crispy", preco: 5, custo: 1.5 },
  { nome: "Pimenta e Sal", preco: 0.4, custo: 0.1 },
  { nome: "Talheres", preco: 0.5, custo: 0.2 }
];

const INIT_BEBIDAS = [
  { nome: "Coca Lata 350ml", preco: 8, custo: 3.5 },
  { nome: "Coca Zero Lata", preco: 8, custo: 3.5 },
  { nome: "Sprite Lata", preco: 8, custo: 3.5 },
  { nome: "Fanta Laranja", preco: 8, custo: 3.5 },
  { nome: "Fanta Uva", preco: 8, custo: 3.5 },
  { nome: "Coca 600ml", preco: 10, custo: 5 },
  { nome: "Coca 2L", preco: 19, custo: 9 },
  { nome: "Água", preco: 5, custo: 1.5 },
  { nome: "Suco Del Valle", preco: 8, custo: 3.5 },
  { nome: "Monster", preco: 21, custo: 12 },
  { nome: "Vinho 750ml", preco: 49.9, custo: 25 }
];

const INIT_BRINDES = [
  { nome: "Copo Torre de Pisa" },
  { nome: "Copo Coliseu" },
  { nome: "Copo Vaticano" }
];

const INIT_PRODUTOS = [
  { nome: "Bolonhesa", cat: "macarrao", ifood_p: 39.5, ifood_g: 48.6, anota_p: 35, anota_g: 44 },
  { nome: "Broccoli", cat: "macarrao", ifood_p: 43, ifood_g: 47.3, anota_p: 38, anota_g: 43 },
  { nome: "Ragu de Costela", cat: "macarrao", ifood_p: 50.7, ifood_g: 55, anota_p: 46, anota_g: 50 },
  { nome: "Quatro Queijos", cat: "macarrao", ifood_p: 47.4, ifood_g: 54.7, anota_p: 43, anota_g: 50 },
  { nome: "Cheddar Bacon", cat: "macarrao", ifood_p: 47.3, ifood_g: 55.5, anota_p: 43, anota_g: 50 },
  { nome: "Camarão Rosé", cat: "macarrao", ifood_p: 56.5, ifood_g: 72.6, anota_p: 52, anota_g: 68 },
  { nome: "Pomodoro", cat: "macarrao", ifood_p: 27.8, ifood_g: 42.5, anota_p: 24, anota_g: 38 },
  { nome: "Frango Requeijão", cat: "macarrao", ifood_p: 49.5, ifood_g: 61.2, anota_p: 45, anota_g: 56 },
  { nome: "Funghi", cat: "macarrao", ifood_p: 36.8, ifood_g: 44.9, anota_p: 33, anota_g: 40 },
  { nome: "Parisiense", cat: "macarrao", ifood_p: 42.6, ifood_g: 45.2, anota_p: 38, anota_g: 41 },
  { nome: "Cheddar Carne Bacon", cat: "macarrao", ifood_p: 52.8, ifood_g: 59.1, anota_p: 48, anota_g: 54 },
  { nome: "Risoto Ragu", cat: "risoto", ifood_p: 0, ifood_g: 58.1, anota_p: 0, anota_g: 53 },
  { nome: "Risoto Camarão", cat: "risoto", ifood_p: 0, ifood_g: 70.4, anota_p: 0, anota_g: 65 },
  { nome: "Risoto 4 Queijos", cat: "risoto", ifood_p: 0, ifood_g: 49.9, anota_p: 0, anota_g: 45 },
  { nome: "Risoto Funghi", cat: "risoto", ifood_p: 0, ifood_g: 44.5, anota_p: 0, anota_g: 40 },
  { nome: "Nhoque 4 Queijos", cat: "nhoque", ifood_p: 0, ifood_g: 64.6, anota_p: 0, anota_g: 60 },
  { nome: "Nhoque Ragu", cat: "nhoque", ifood_p: 0, ifood_g: 67.5, anota_p: 0, anota_g: 62 },
  { nome: "Nhoque Bolonhesa", cat: "nhoque", ifood_p: 0, ifood_g: 60.5, anota_p: 0, anota_g: 55 },
  { nome: "Tiramisu", cat: "sobremesa", ifood_p: 18.8, ifood_g: 0, anota_p: 16, anota_g: 0 },
  { nome: "Cannoli", cat: "sobremesa", ifood_p: 11.9, ifood_g: 0, anota_p: 10, anota_g: 0 }
];

const INIT_COMBOS = [
  { nome: "Combo Grande", preco_ifood: 63.5, preco_anota: 58, qp: 0, qg: 1, bebida_id: 1, brinde_id: null },
  { nome: "Combo Casal", preco_ifood: 120.7, preco_anota: 110, qp: 0, qg: 2, bebida_id: 6, brinde_id: null },
  { nome: "Combo Boiadeirinha", preco_ifood: 42.4, preco_anota: 38, qp: 1, qg: 0, bebida_id: 9, brinde_id: 1 }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Limpar tabelas
    await sql`TRUNCATE massas, extras, bebidas, brindes, produtos, combos RESTART IDENTITY CASCADE`;

    // Inserir massas
    for (const m of INIT_MASSAS) {
      await sql`INSERT INTO massas (nome, custo_p, custo_g) VALUES (${m.nome}, ${m.custo_p}, ${m.custo_g})`;
    }

    // Inserir extras
    for (const e of INIT_EXTRAS) {
      await sql`INSERT INTO extras (nome, preco, custo) VALUES (${e.nome}, ${e.preco}, ${e.custo})`;
    }

    // Inserir bebidas
    for (const b of INIT_BEBIDAS) {
      await sql`INSERT INTO bebidas (nome, preco, custo) VALUES (${b.nome}, ${b.preco}, ${b.custo})`;
    }

    // Inserir brindes
    for (const b of INIT_BRINDES) {
      await sql`INSERT INTO brindes (nome) VALUES (${b.nome})`;
    }

    // Inserir produtos
    for (const p of INIT_PRODUTOS) {
      await sql`INSERT INTO produtos (nome, cat, ifood_p, ifood_g, anota_p, anota_g) VALUES (${p.nome}, ${p.cat}, ${p.ifood_p}, ${p.ifood_g}, ${p.anota_p}, ${p.anota_g})`;
    }

    // Inserir combos
    for (const c of INIT_COMBOS) {
      await sql`INSERT INTO combos (nome, preco_ifood, preco_anota, qp, qg, bebida_id, brinde_id) VALUES (${c.nome}, ${c.preco_ifood}, ${c.preco_anota}, ${c.qp}, ${c.qg}, ${c.bebida_id}, ${c.brinde_id})`;
    }

    res.json({ ok: true, message: 'Dados iniciais inseridos com sucesso!' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
