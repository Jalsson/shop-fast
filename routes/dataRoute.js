'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: './uploads/'});
const dataController = require('../controllers/dataController');
const { ensureAuthenticated} = require('../controllers/auth')

router.get('/', ensureAuthenticated, dataController.products_get);
router.get('/pics', ensureAuthenticated, dataController.pictures_get);
router.get('/pic', ensureAuthenticated, (req,res) => {res.render('index')});
router.get('/pic/filter', dataController.getFilteredImages)
//
router.post('/', ensureAuthenticated, upload.array('url[]', 3), dataController.data_post);


module.exports = router;