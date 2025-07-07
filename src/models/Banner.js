const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  image: {
    type: String,
    trim: true
  },
  startColor: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: 'Cor inicial deve ser um código hexadecimal válido'
    }
  },
  endColor: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: 'Cor final deve ser um código hexadecimal válido'
    }
  },
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true,
    maxlength: [100, 'Título deve ter no máximo 100 caracteres']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [200, 'Subtítulo deve ter no máximo 200 caracteres']
  },
  actionButtonText: {
    type: String,
    trim: true,
    maxlength: [50, 'Texto do botão deve ter no máximo 50 caracteres']
  },
  actionButtonUrl: {
    type: String,
    trim: true,
    maxlength: [500, 'URL do botão deve ter no máximo 500 caracteres'],
    validate: {
      validator: function(v) {
        if (this.actionButtonText && !v) {
          return false;
        }
        return true;
      },
      message: 'URL do botão é obrigatória quando o texto do botão é fornecido'
    }
  },
  order: {
    type: Number,
    min: [1, 'Ordem deve ser maior que 0'],
    default: function() {
      return this.constructor.countDocuments().then(count => count + 1);
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

bannerSchema.index({ order: 1, isActive: 1 });

bannerSchema.pre('save', function(next) {
  if (this.actionButtonText && !this.actionButtonUrl) {
    return next(new Error('URL do botão é obrigatória quando o texto do botão é fornecido'));
  }
  next();
});

module.exports = mongoose.model('Banner', bannerSchema); 