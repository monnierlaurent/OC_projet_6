const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const SauceValidation = require('../middleware/datasValidation');

//CRUD

// router pour la creation d'une sauce
router.post('/', auth, multer, SauceValidation, sauceCtrl.createSauce);

// router pour la modification d'une sauce
router.put('/:id', auth, multer, SauceValidation, sauceCtrl.updateSauce);

// router pour la suppression d'une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);
// router pour la recupération d'une seul sauce par sont ID
router.get('/:id', auth, sauceCtrl.displayIdSauce);

// router pour la recupération de toute les sauces
router.get('/', auth, sauceCtrl.displaySauce);

// router pour l'appreciation d'une sauce
router.post('/:id/like', auth, sauceCtrl.likeSauce);



module.exports = router;