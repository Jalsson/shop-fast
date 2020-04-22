const express = require('express')
const router = express.Router()
const multer = require('multer');
const upload = multer({dest: './uploads/'});
const dataController = require('../controllers/dataController');

// index page
//router.get('/', (req,res) => {res.render('Welcome')})
router.get('/image', (req,res) => {res.render('index')});

router.get('/:id', dataController.image_get);
module.exports = router