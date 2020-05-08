'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: './uploads/'});
const dataController = require('../controllers/dataController');
const { ensureAuthenticated} = require('../controllers/auth')

//routes for product page (frontpage)
//pics only returns json
router.get('/', ensureAuthenticated, dataController.products_get);
router.get('/pics', ensureAuthenticated, dataController.pictures_get);
router.get('/pic', ensureAuthenticated, (req,res) => {res.render('index',{
    name: req.user.username,
    email: req.user.email,
    id: req.user.id
})});

//data posting
router.post('/', ensureAuthenticated, upload.array('url[]', 3), dataController.data_post);


module.exports = router;