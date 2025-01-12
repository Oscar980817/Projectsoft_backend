const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const auth = require('../middleware/auth');

router.get('/', auth, photoController.getPhotosByCiv);
router.post('/', auth, photoController.uploadPhoto);

module.exports = router;