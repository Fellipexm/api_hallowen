const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('./prisma/client'); 

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

const prisma = new PrismaClient();

app.post('/users', async (req, res) => {
  const { username, password, cashback, availableBalance } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        password,
        cashback,
        availableBalance,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao inserir usuário no banco de dados:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('Erro ao recuperar usuários do banco de dados:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.get('/users/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao recuperar usuário do banco de dados:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
