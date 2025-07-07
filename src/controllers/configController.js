const { validationResult } = require('express-validator');
const Config = require('../models/Config');

const configController = {
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        street,
        number,
        neighborhood,
        city,
        state,
        zipCode,
        phone,
        whatsapp,
        email
      } = req.body;

      const existingConfig = await Config.findOne();
      if (existingConfig) {
        return res.status(400).json({ error: 'Já existe uma configuração. Use PUT para atualizar.' });
      }

      const config = new Config({
        street,
        number,
        neighborhood,
        city,
        state,
        zipCode,
        phone,
        whatsapp,
        email
      });

      await config.save();

      res.status(201).json({
        message: 'Configuração criada com sucesso',
        config
      });
    } catch (error) {
      console.error('Erro ao criar configuração:', error);
      res.status(500).json({ error: 'Erro ao criar configuração' });
    }
  },

  async get(req, res) {
    try {
      const config = await Config.findOne();
      
      if (!config) {
        return res.status(404).json({ error: 'Configuração não encontrada' });
      }

      res.json({
        config
      });
    } catch (error) {
      console.error('Erro ao buscar configuração:', error);
      res.status(500).json({ error: 'Erro ao buscar configuração' });
    }
  },

  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        street,
        number,
        neighborhood,
        city,
        state,
        zipCode,
        phone,
        whatsapp,
        email
      } = req.body;

      let config = await Config.findOne();
      
      if (!config) {
        return res.status(404).json({ error: 'Configuração não encontrada' });
      }

      if (street !== undefined) config.street = street;
      if (number !== undefined) config.number = number;
      if (neighborhood !== undefined) config.neighborhood = neighborhood;
      if (city !== undefined) config.city = city;
      if (state !== undefined) config.state = state;
      if (zipCode !== undefined) config.zipCode = zipCode;
      if (phone !== undefined) config.phone = phone;
      if (whatsapp !== undefined) config.whatsapp = whatsapp;
      if (email !== undefined) config.email = email;

      await config.save();

      res.json({
        message: 'Configuração atualizada com sucesso',
        config
      });
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      res.status(500).json({ error: 'Erro ao atualizar configuração' });
    }
  },

  async delete(req, res) {
    try {
      const config = await Config.findOne();
      
      if (!config) {
        return res.status(404).json({ error: 'Configuração não encontrada' });
      }

      await Config.findByIdAndDelete(config._id);

      res.json({
        message: 'Configuração deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar configuração:', error);
      res.status(500).json({ error: 'Erro ao deletar configuração' });
    }
  }
};

module.exports = configController; 