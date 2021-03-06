const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/profil');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.get('/', auth, sauceCtrl.getProfil);

router.put('/', auth, multer, sauceCtrl.modifyProfil);

router.delete('/', auth, sauceCtrl.deleteProfil);


module.exports = router;