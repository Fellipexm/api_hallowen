const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 80;

app.use(bodyParser.json());
app.use(cors());

const users = [];

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/users/:name', (req, res) => {
  const userName = req.params.name;
  const user = users.find((u) => u.nome === userName);

  if (user) {
    res.json({
      nome: user.nome,
      email: user.email,
      pontos: user.pontos || 0,
      dinheiro: user.dinheiro || 0,
    });
  } else {
    res.status(404).json({ message: 'Usuário não encontrado' });
  }
});

app.post('/users', (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Campos obrigatórios ausentes ou vazios' });
  }

  const newUser = {
    nome,
    email,
    senha,
    pontos: 0,
    dinheiro: 0,
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

app.post('/login', (req, res) => {
  const { nome, senha } = req.body;

  if (!nome || !senha) {
    return res.status(400).json({ message: 'Campos obrigatórios ausentes ou vazios' });
  }

  const userIndex = users.findIndex((u) => u.nome === nome);

  if (userIndex !== -1 && users[userIndex].senha === senha) {
    users[userIndex].pontos = (users[userIndex].pontos || 0) + 100;
    users[userIndex].dinheiro = (users[userIndex].dinheiro || 0) + 50;

    const { nome, email, pontos, dinheiro } = users[userIndex];
    res.json({ nome, email, pontos, dinheiro });
  } else {
    res.status(401).json({ message: 'Nome de usuário ou senha incorretos' });
  }
});

app.put('/users/:name', (req, res) => {
  const userName = req.params.name;
  const userIndex = users.findIndex((u) => u.nome === userName);

  if (userIndex !== -1) {
    const { pontos, dinheiro } = req.body;

    if (pontos !== undefined) {
      users[userIndex].pontos = Math.max(pontos, 0);
    }

    if (dinheiro !== undefined) {
      users[userIndex].dinheiro = Math.max(dinheiro, 0);
    }

    res.json(users[userIndex]);
  } else {
    res.status(404).json({ message: 'Usuário não encontrado' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});