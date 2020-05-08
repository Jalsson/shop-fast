const express = require('express')
const router = express.Router()
const { ensureAuthenticated} = require('../controllers/auth')
// Front page here
router.get('/frontpage',ensureAuthenticated, (req,res) => {
    res.render('index',{
        name: req.user.username,
        email: req.user.email,
        id: req.user.id
    })})
router.get('/', (req,res) => {res.render('welcome')})

module.exports = router     