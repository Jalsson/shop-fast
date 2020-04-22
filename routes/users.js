const express = require('express')
const router = express.Router()
const userModel = require('../models/userModel');
//const userController = require('../controllers/userController');
// Login page
router.get('/login', (req,res) => {res.render('login')})

// Register page
router.get('/register', (req,res) => {res.render('register')})
//router.post('/insertUser', userModel.insertUser());

// register Handle here
router.post('/register',(req,res) => {
   const{name, email, password, password2} = req.body
    let errors = []

    // checking required fields 
    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all fields'})
    }

    // Check if passwords match
    if(password !== password2){
        errors.push({msg: 'Passwords do not match'})
    }

    // Check passwords lenght
    if(password.lenght < 6){
        errors.push({msg: 'Passwords should be at least 6 characters'})
    }

})

module.exports = router