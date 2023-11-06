const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const PORT = 3000;
const hoek = require('hoek');

app.use(bodyParser.json());
app.use(cors());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'hallowen.cluster-ceycyd1m7eei.us-east-1.rds.amazonaws.com',
  user: 'admin', 
  password: 'senacminas', 
  database: 'hallowen' 
});

app.post('/users', (req, res) => {
  const { username, password, cashback, availableBalance } = req.body;
  pool.query(
    'INSERT INTO users (username, password, cashback, available_balance) VALUES (?, ?, ?, ?)',
    [username, password, cashback, availableBalance],
    (error, results) => {
      if (error) {
        console.error('Erro ao inserir usuário no banco de dados:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
      } else {
        res.status(201).json(results);
      }
    }
  );
});

app.get('/users', (req, res) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.error('Erro ao recuperar usuários do banco de dados:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    } else {
      res.json(results);
    }
  });
});

app.get('/users/:username', (req, res) => {
  const { username } = req.params;
  pool.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
    if (error) {
      console.error('Erro ao recuperar usuário do banco de dados:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    } else if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
