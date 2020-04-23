const LocalStragery = require('passport-local').Strategy
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs')

module.exports = function (passport) {
    passport.use(
        new LocalStragery({usernameField: 'username'}, (email, password, done) => {
            userModel.selectUser({email: email})
            .then(user => {
                if (!user[0]) {
                    return done(null, false);
                }
            })
            .catch(err => console.log(err))
        })
    )
}