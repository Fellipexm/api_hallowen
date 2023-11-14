const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const IP = '172.16.31.43'; // Substitua pelo IP desejado

app.use(bodyParser.json());
app.use(cors());

// Placeholder for in-memory "database"
const users = [];

// Rota para obter todos os usuários
app.get('/users', (req, res) => {
  res.json(users);
});

// Rota para criar um novo usuário
app.post('/users', (req, res) => {
  const { nome, email, senha } = req.body;

  // Verifique se os campos obrigatórios estão presentes e não são vazios
  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Campos obrigatórios ausentes ou vazios' });
  }

  const newUser = {
    nome,
    email,
    senha,
  };

  // Adicione o novo usuário à "base de dados" na memória
  users.push(newUser);

  res.status(201).json(newUser);
});

// Rota para fazer login
app.post('/login', (req, res) => {
  const { nome, senha } = req.body;

  // Verifique se os campos obrigatórios estão presentes e não são vazios
  if (!nome || !senha) {
    return res.status(400).json({ message: 'Campos obrigatórios ausentes ou vazios' });
  }

  // Encontre o usuário com o nome fornecido
  const user = users.find((u) => u.nome === nome);

  if (user && user.senha === senha) {
    // Se o usuário existe e a senha está correta, retornar informações de usuário
    const { nome, email } = user;
    res.json({ nome, email });
  } else {
    res.status(401).json({ message: 'Nome de usuário ou senha incorretos' });
  }
});

app.listen(PORT, IP, () => {
  console.log(`Servidor está rodando em http://${IP}:${PORT}`);
});
