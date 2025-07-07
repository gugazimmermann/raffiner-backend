const { validationResult } = require('express-validator');
const Banner = require('../models/Banner');
const fs = require('fs');
const path = require('path');

const bannerController = {
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        startColor,
        endColor,
        title,
        subtitle,
        actionButtonText,
        actionButtonUrl,
        order
      } = req.body;

      if (actionButtonText && !actionButtonUrl) {
        return res.status(400).json({ 
          error: 'URL do botão é obrigatória quando o texto do botão é fornecido' 
        });
      }

      let bannerOrder = order;
      if (!bannerOrder) {
        const maxOrderBanner = await Banner.findOne().sort({ order: -1 });
        bannerOrder = maxOrderBanner ? maxOrderBanner.order + 1 : 1;
      }

      let imagePath = null;
      if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;
      }

      const banner = new Banner({
        image: imagePath,
        startColor,
        endColor,
        title,
        subtitle,
        actionButtonText,
        actionButtonUrl,
        order: bannerOrder
      });

      await banner.save();

      res.status(201).json({
        message: 'Banner criado com sucesso',
        banner
      });
    } catch (error) {
      console.error('Erro ao criar banner:', error);
      res.status(500).json({ error: 'Erro ao criar banner' });
    }
  },

  async getAll(req, res) {
    try {
      const { active = 'true' } = req.query;
      const isActive = active === 'true';
      
      const banners = await Banner.find({ isActive })
        .sort({ order: 1 })
        .select('-__v');

      res.json({
        banners,
        count: banners.length
      });
    } catch (error) {
      console.error('Erro ao buscar banners:', error);
      res.status(500).json({ error: 'Erro ao buscar banners' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const banner = await Banner.findById(id).select('-__v');
      
      if (!banner) {
        return res.status(404).json({ error: 'Banner não encontrado' });
      }

      res.json({
        banner
      });
    } catch (error) {
      console.error('Erro ao buscar banner:', error);
      res.status(500).json({ error: 'Erro ao buscar banner' });
    }
  },

  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const {
        startColor,
        endColor,
        title,
        subtitle,
        actionButtonText,
        actionButtonUrl,
        order,
        isActive
      } = req.body;

      const banner = await Banner.findById(id);
      
      if (!banner) {
        return res.status(404).json({ error: 'Banner não encontrado' });
      }

      if (actionButtonText && !actionButtonUrl) {
        return res.status(400).json({ 
          error: 'URL do botão é obrigatória quando o texto do botão é fornecido' 
        });
      }

      if (req.file) {
        if (banner.image) {
          const oldImagePath = path.join(__dirname, '..', banner.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        banner.image = `/uploads/${req.file.filename}`;
      }

      if (startColor !== undefined) banner.startColor = startColor;
      if (endColor !== undefined) banner.endColor = endColor;
      if (title !== undefined) banner.title = title;
      if (subtitle !== undefined) banner.subtitle = subtitle;
      if (actionButtonText !== undefined) banner.actionButtonText = actionButtonText;
      if (actionButtonUrl !== undefined) banner.actionButtonUrl = actionButtonUrl;
      if (order !== undefined) banner.order = order;
      if (isActive !== undefined) banner.isActive = isActive;

      await banner.save();

      res.json({
        message: 'Banner atualizado com sucesso',
        banner
      });
    } catch (error) {
      console.error('Erro ao atualizar banner:', error);
      res.status(500).json({ error: 'Erro ao atualizar banner' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const banner = await Banner.findById(id);
      
      if (!banner) {
        return res.status(404).json({ error: 'Banner não encontrado' });
      }

      if (banner.image) {
        const imagePath = path.join(__dirname, '..', banner.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await Banner.findByIdAndDelete(id);

      res.json({
        message: 'Banner deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar banner:', error);
      res.status(500).json({ error: 'Erro ao deletar banner' });
    }
  },

  async reorder(req, res) {
    try {
      const { bannerIds } = req.body;

      if (!Array.isArray(bannerIds) || bannerIds.length === 0) {
        return res.status(400).json({ error: 'Lista de IDs de banners é obrigatória' });
      }

      const updatePromises = bannerIds.map((bannerId, index) => {
        return Banner.findByIdAndUpdate(bannerId, { order: index + 1 });
      });

      await Promise.all(updatePromises);

      res.json({
        message: 'Ordem dos banners atualizada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao reordenar banners:', error);
      res.status(500).json({ error: 'Erro ao reordenar banners' });
    }
  }
};

module.exports = bannerController; 