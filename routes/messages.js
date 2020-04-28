const express = require('express')
const router = express.Router()
const messageModel = require('../models/messageModel');
const { ensureAuthenticated} = require('../controllers/auth')
//const dataController = require('../controllers/dataController');

router.get('/',ensureAuthenticated, (req,res) => {
    res.render('messages',{
        name: req.user.username,
        email: req.user.email
    })})


router.get('/loadMessages',ensureAuthenticated, function(req,res) {
    messageModel.selectMessages(req.user.id).then( messages => {
        res.json(messages)
    });
    
})
module.exports = router 