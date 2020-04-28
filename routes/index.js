const express = require('express')
const router = express.Router()
const { ensureAuthenticated} = require('../controllers/auth')
//const dataController = require('../controllers/dataController');


// index page

// Front page here
router.get('/frontpage',ensureAuthenticated, (req,res) => {
    res.render('messages',{
        name: req.user.username,
        email: req.user.email,
        id :req.user.id
    })})

router.get('/messages',ensureAuthenticated, (req,res) => {
    res.render('messages',{
        name: req.user.username,
        email: req.user.email
    })})
//router.get('/', (req,res) => {res.render('Welcome')})
//router.get('/', (req,res) => {res.render('index')});
//router.get('/product', dataController.products_get);
//router.get('/:id', dataController.image_get);
module.exports = router     