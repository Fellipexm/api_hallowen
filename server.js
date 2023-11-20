const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 80; // Altera a porta para usar a variável de ambiente do Render

app.use(bodyParser.json());
app.use(cors());

// Placeholder para in-memory "database"
const users = [];

// Rota para obter todos os usuários
app.get('/users', (req, res) => {
  res.json(users);
});

// Rota para obter informações de um usuário específico
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

// Rota para criar um novo usuário
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
    dinheiro: 0, // Adiciona o campo dinheiro com valor inicial 0
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

// Rota para fazer login
app.post('/login', (req, res) => {
  const { nome, senha } = req.body;

  if (!nome || !senha) {
    return res.status(400).json({ message: 'Campos obrigatórios ausentes ou vazios' });
  }

  const userIndex = users.findIndex((u) => u.nome === nome);

  if (userIndex !== -1 && users[userIndex].senha === senha) {
    // Se o usuário existe e a senha está correta, atualizar pontos e dinheiro, e retornar informações de usuário
    users[userIndex].pontos = (users[userIndex].pontos || 0) + 100;
    users[userIndex].dinheiro = (users[userIndex].dinheiro || 0) + 50;

    const { nome, email, pontos, dinheiro } = users[userIndex];
    res.json({ nome, email, pontos, dinheiro });
  } else {
    res.status(401).json({ message: 'Nome de usuário ou senha incorretos' });
  }
});

// Rota para atualizar informações de um usuário usando PUT
app.put('/users/:name', (req, res) => {
  const userName = req.params.name;
  const userIndex = users.findIndex((u) => u.nome === userName);

  if (userIndex !== -1) {
    const { pontos, dinheiro } = req.body;

    if (pontos !== undefined) {
      users[userIndex].pontos = pontos;
    }

    if (dinheiro !== undefined) {
      users[userIndex].dinheiro = dinheiro;
    }

    res.json(users[userIndex]);
  } else {
    res.status(404).json({ message: 'Usuário não encontrado' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
