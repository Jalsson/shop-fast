const express = require('express')
const router = express.Router()
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs')
const passport = require('passport')

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

    if(errors.length > 0){
        res.render("register",{
            errors,
            name,
            email,
            password,
            password2
        })
    }else{
        userModel.selectUser({email: email})
        .then(user => {
                if(user[0]){
                        // User exits 
                        errors.push({msg: 'Username or email already exits'})
                        res.render("register",{
                            errors,
                            name,
                            email,
                            password,
                            password2
                        })
                 }
                 else{
                    const newUser = {
                        name,
                        email,
                        password
                    }
                    //Hash password
                    bcrypt.genSalt(15, function(err,salt){
                        bcrypt.hash(newUser.password, salt, function(err, hash){
                            if(err) throw err
                            // Set password to hashed
                            newUser.password = hash
                            // saving user to database
                            userModel.insertUser(newUser).then(user => {
                                req.flash("success_msg", "You are now registered and can log in")
                                res.redirect('/users/login')
                            })
                            .catch(err => console.log(err))
                    })})
                 }
            })
    }
})


// Login handle
router.post('/login',function(req,res,next){
    passport.authenticate('local',{
        successRedirect: '/frontpage',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

//Logout hangle
router.get('/logout', function(req, res){
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
})
module.exports = router