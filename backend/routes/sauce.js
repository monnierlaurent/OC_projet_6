const express = require('express');
const routeValidator = require('express-route-validator');
const { SauceValidation } = require('../middleware/datasValidation')

const router = express.Router();

const userCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('/', auth, SauceValidation, multer, userCtrl.createSauce);
router.put('/:id', auth, SauceValidation, multer, userCtrl.updateSauce);
router.delete('/:id', auth, userCtrl.deleteSauce);
router.get('/:id', auth, userCtrl.displayIdSauce);
router.get('/', auth, userCtrl.displaySauce);
router.post('/:id/like', auth, userCtrl.likeSauce);



module.exports = router;