const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  street: {
    type: String,
    required: [true, 'Rua é obrigatória'],
    trim: true
  },
  number: {
    type: Number,
    required: [true, 'Número é obrigatório'],
    min: [1, 'Número deve ser maior que 0']
  },
  neighborhood: {
    type: String,
    required: [true, 'Bairro é obrigatório'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Cidade é obrigatória'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'Estado é obrigatório'],
    trim: true,
    minlength: [2, 'Estado deve ter pelo menos 2 caracteres'],
    maxlength: [2, 'Estado deve ter no máximo 2 caracteres']
  },
  zipCode: {
    type: Number,
    required: [true, 'CEP é obrigatório'],
    min: [10000000, 'CEP deve ter 8 dígitos'],
    max: [99999999, 'CEP deve ter 8 dígitos']
  },
  phone: {
    type: Number,
    required: [true, 'Telefone é obrigatório'],
    min: [1000000000, 'Telefone deve ter pelo menos 10 dígitos'],
    max: [999999999999, 'Telefone deve ter no máximo 12 dígitos']
  },
  whatsapp: {
    type: Number,
    required: [true, 'WhatsApp é obrigatório'],
    min: [1000000000, 'WhatsApp deve ter pelo menos 10 dígitos'],
    max: [999999999999, 'WhatsApp deve ter no máximo 12 dígitos']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Config', configSchema); 