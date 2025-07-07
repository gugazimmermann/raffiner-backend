const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');
const bannerController = require('../controllers/bannerController');

const router = express.Router();

const bannerValidation = [
  body('startColor').optional().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^$/).withMessage('Cor inicial deve ser um código hexadecimal válido'),
  body('endColor').optional().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^$/).withMessage('Cor final deve ser um código hexadecimal válido'),
  body('title').isString().trim().isLength({ min: 1, max: 100 }).withMessage('Título é obrigatório e deve ter entre 1 e 100 caracteres'),
  body('subtitle').optional().isString().trim().isLength({ max: 200 }).withMessage('Subtítulo deve ter no máximo 200 caracteres'),
  body('actionButtonText').optional().isString().trim().isLength({ max: 50 }).withMessage('Texto do botão deve ter no máximo 50 caracteres'),
  body('actionButtonUrl').optional().isURL().withMessage('URL do botão deve ser uma URL válida'),
  body('order').optional().isInt({ min: 1 }).withMessage('Ordem deve ser um número inteiro maior que 0'),
  body('isActive').optional().isBoolean().withMessage('isActive deve ser um valor booleano')
];

const reorderValidation = [
  body('bannerIds').isArray({ min: 1 }).withMessage('bannerIds deve ser um array não vazio de IDs')
];

router.post('/', authMiddleware, upload.single('image'), handleMulterError, bannerValidation, bannerController.create);
router.get('/', bannerController.getAll);
router.get('/:id', bannerController.getById);
router.put('/:id', authMiddleware, upload.single('image'), handleMulterError, bannerValidation, bannerController.update);
router.delete('/:id', authMiddleware, bannerController.delete);
router.put('/reorder', authMiddleware, reorderValidation, bannerController.reorder);

module.exports = router; 