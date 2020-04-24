'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: './uploads/'});
const dataController = require('../controllers/dataController');

router.get('/', dataController.products_get);
router.get('/pics', dataController.pictures_get);
router.get('/pic', (req,res) => {res.render('index')});

router.post('/', upload.single('url'), dataController.data_post);
    
module.exports = router;