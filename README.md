# CMV Control - Ital'in House

Sistema de controle de CMV (Custo de Mercadoria Vendida) para restaurante.

## 🚀 Deploy no Vercel + Neon

### 1. Configurar Neon Database

1. Acesse [neon.tech](https://neon.tech) e crie uma conta
2. Crie um novo projeto
3. Copie a **Connection String** (DATABASE_URL)

### 2. Configurar Vercel

1. Faça push do projeto para o GitHub
2. Importe o repositório no [vercel.com](https://vercel.com)
3. Em **Settings > Environment Variables**, adicione:
   - `DATABASE_URL` = sua connection string do Neon

### 3. Deploy

```bash
# Clone o repositório
git clone <seu-repo>
cd cmv-pro

# Instalar dependências (opcional, para teste local)
npm install

# Deploy no Vercel
vercel
```

### 4. Inicializar Banco de Dados

Após o deploy, acesse a aplicação e vá em **⚙️ Config**:
1. Clique em **🔧 Setup DB** para criar as tabelas
2. Clique em **🌱 Dados Iniciais** para popular dados de exemplo

## 📁 Estrutura

```
cmv-pro/
├── api/
│   ├── _db.js          # Conexão Neon
│   ├── ingredientes.js # CRUD ingredientes
│   ├── massas.js       # CRUD massas
│   ├── extras.js       # CRUD extras
│   ├── bebidas.js      # CRUD bebidas
│   ├── brindes.js      # CRUD brindes
│   ├── produtos.js     # CRUD produtos
│   ├── combos.js       # CRUD combos
│   ├── fichas.js       # CRUD fichas técnicas
│   ├── vendas.js       # CRUD vendas
│   ├── setup.js        # Criar tabelas
│   └── seed.js         # Dados iniciais
├── public/
│   └── index.html      # Frontend
├── schema.sql          # SQL para referência
├── package.json
├── vercel.json
└── README.md
```

## 🗃️ Tabelas

| Tabela | Descrição |
|--------|-----------|
| ingredientes | Ingredientes com custo |
| massas | Tipos de massa (custo P/G) |
| extras | Extras vendidos |
| bebidas | Bebidas |
| brindes | Brindes dos combos |
| produtos | Produtos com 4 preços (iFood P/G, AnotaAi P/G) |
| combos | Combos com composição |
| fichas | Fichas técnicas |
| vendas | Importações mensais |

## 💡 Funcionalidades

- ✅ Cadastro de ingredientes, massas, extras, bebidas
- ✅ Produtos com preços diferentes por cardápio (iFood / AnotaAi)
- ✅ Fichas técnicas com cálculo de custo
- ✅ Importação de vendas via Excel
- ✅ Redistribuição de itens de combos
- ✅ Dashboard com KPIs e gráficos
- ✅ Análise por período e cardápio
- ✅ Comparativo entre períodos
