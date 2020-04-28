const express = require('express')
const router = express.Router()
const messageModel = require('../models/messageModel');
const userModel = require('../models/userModel');
const { ensureAuthenticated} = require('../controllers/auth')
//const dataController = require('../controllers/dataController');

router.get('/',ensureAuthenticated, (req,res) => {
    messageModel.selectMessages(req.user.id).then( messages => {
        res.render('messages',{
            name: req.user.username,
            email: req.user.email,
            id: req.user.id,
            messages: JSON.stringify(messages)
        })
    });
})


router.get('/loadMessages',ensureAuthenticated, function(req,res) {
    messageModel.selectMessages(req.user.id).then( messages => {
        res.json(messages)
    });
})

router.get('/getName',ensureAuthenticated,function(req,res){
    let otherName = req.body.otherName
    userModel.selectUser({name: otherName})
    .then(user => { 
        res.json(user.username)
    })
})
module.exports = router