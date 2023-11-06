const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

const users = [];

app.post('/users', (req, res) => {
  const { username, password, cashback, availableBalance } = req.body;
  const newUser = { username, password, cashback, availableBalance };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/users/:username', (req, res) => {
  const { username } = req.params;
  const user = users.find(u => u.username === username);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'Usuário não encontrado' });
  }
});

app.listen(PORT, '172.16.31.43', () => {
  console.log(`Servidor está rodando em http://172.16.31.43:${PORT}`);
});
