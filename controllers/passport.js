const LocalStragery = require('passport-local').Strategy
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs')

// defines a local authentication strategy where user is given a cookie to authenticate a session
module.exports = function (passport) {
    passport.use(
        new LocalStragery({usernameField: 'email'}, function(email, password, done) {
            userModel.selectUser({email: email})
            .then(user => {
                if (!user) {
                    return done(null, false,{message: 'That email is not registered'})
                }

                // Match password
                bcrypt.compare(password, user.password, function(err, isMatch){
                    if(err) throw err

                    if (isMatch) {
                        return done(null,user)
                    }else{
                        return done(null, false, {message: 'password incorrect'})
                    }
                });
            })
            .catch(err => console.log(err))
        })
    )

    passport.serializeUser(function(user, done) {
        done(null, user);
      })
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      })
}