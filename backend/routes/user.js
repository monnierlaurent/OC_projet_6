const express = require('express');
const router = express.Router();

const rateLimiter = require('../middleware/rateLimit');
const userCtrl = require('../controllers/user')
    // middleware pour l'enregistrement d'un utilisateur
router.post('/signup', userCtrl.createUser);

// middleware pour l'authentification d'un utilisateur
router.post('/login', rateLimiter, userCtrl.loginUser);

module.exports = router;