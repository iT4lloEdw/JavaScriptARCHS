const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Crie um banco de dados SQLite em memória (para fins de demonstração).
const db = new sqlite3.Database(':memory:');

// Crie tabelas para clientes e ordens de serviço.
db.serialize(() => {
  db.run("CREATE TABLE clients (id INTEGER PRIMARY KEY, nome TEXT, telefone TEXT, endereco TEXT)");
  db.run("CREATE TABLE orders (os_id INTEGER PRIMARY KEY, tipo TEXT, aparelho TEXT, modelo TEXT, marca TEXT, numero_serie TEXT, proprietario TEXT, defeito_alegado TEXT, defeito_constatado TEXT, valor_conserto REAL)");
});

// Rota para cadastrar um cliente.
app.post('/api/clientes', (req, res) => {
  const { nome, telefone, endereco } = req.body;
  db.run("INSERT INTO clients (nome, telefone, endereco) VALUES (?, ?, ?)", [nome, telefone, endereco], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Cliente cadastrado com sucesso.' });
  });
});

// Rota para criar uma ordem de serviço.
app.post('/api/ordens', (req, res) => {
  const { tipo, aparelho, modelo, marca, numero_serie, proprietario, defeito_alegado, defeito_constatado, valor_conserto } = req.body;
  db.run("INSERT INTO orders (tipo, aparelho, modelo, marca, numero_serie, proprietario, defeito_alegado, defeito_constatado, valor_conserto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [tipo, aparelho, modelo, marca, numero_serie, proprietario, defeito_alegado, defeito_constatado, valor_conserto], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Ordem de serviço criada com sucesso.' });
    });
});

// Rota para listar todos os clientes.
app.get('/api/clientes', (req, res) => {
  db.all("SELECT * FROM clients", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Rota para listar todas as ordens de serviço.
app.get('/api/ordens', (req, res) => {
  db.all("SELECT * FROM orders", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
