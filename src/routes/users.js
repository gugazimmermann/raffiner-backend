const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  res.json({
    message: 'Lista de usuários',
    user: req.user
  });
});

module.exports = router;
