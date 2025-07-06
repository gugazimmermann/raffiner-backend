const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

let users = [];

const authController = {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      const existingUser = users.find(user => user.email === email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = {
        id: Date.now().toString(),
        name,
        email,
        password: hashedPassword,
        createdAt: new Date()
      };

      users.push(user);

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  },

  // Login
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Buscar usuário
      const user = users.find(u => u.email === email);
      if (!user) {
        return res.status(400).json({ error: 'Credenciais inválidas' });
      }

      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Credenciais inválidas' });
      }

      // Gerar token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  },

  // Perfil do usuário
  async profile(req, res) {
    try {
      const user = users.find(u => u.id === req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
  }
};

module.exports = authController;
