const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
connectDB();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const configRoutes = require('./routes/config');
const bannerRoutes = require('./routes/banners');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/config', configRoutes);
app.use('/api/banners', bannerRoutes);

app.get('/', (req, res) => {
  res.json({
    message: '🎉 API Raffiner Backend funcionando!',
    version: '1.0.0',
    database: 'MongoDB Atlas',
    timestamp: new Date().toISOString()
  });
});

app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
});

module.exports = app;
