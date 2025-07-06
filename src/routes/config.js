const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const configController = require('../controllers/configController');

const router = express.Router();

// Middleware de autenticação para todas as rotas
router.use(authMiddleware);

// Validações
const configValidation = [
  body('street').optional().isString().withMessage('Rua deve ser uma string'),
  body('number').optional().isInt({ min: 1 }).withMessage('Número deve ser um inteiro maior que 0'),
  body('neighborhood').optional().isString().withMessage('Bairro deve ser uma string'),
  body('city').optional().isString().withMessage('Cidade deve ser uma string'),
  body('state').optional().isLength({ min: 2, max: 2 }).withMessage('Estado deve ter 2 caracteres'),
  body('zipCode').optional().isInt({ min: 10000000, max: 99999999 }).withMessage('CEP deve ter 8 dígitos'),
  body('phone').optional().isInt({ min: 1000000000, max: 999999999999 }).withMessage('Telefone deve ter entre 10 e 12 dígitos'),
  body('whatsapp').optional().isInt({ min: 1000000000, max: 999999999999 }).withMessage('WhatsApp deve ter entre 10 e 12 dígitos'),
  body('email').optional().isEmail().withMessage('Email deve ser válido')
];

// Rotas CRUD
router.post('/', configValidation, configController.create); // CREATE
router.get('/', configController.get); // READ
router.put('/', configValidation, configController.update); // UPDATE
router.delete('/', configController.delete); // DELETE

module.exports = router;