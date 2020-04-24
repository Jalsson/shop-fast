require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const flash = require('connect-flash')
const session = require('express-session')
const passport  = require('passport')

const app = express();

//Passport config
require('./controllers/passport')(passport)
app.use(express.static('uploads'));
// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

//Bodyparser
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: false}))

// Express session 
app.use(session({
    secret: 'cat secret thing',
    resave: true,
    saveUninitialized: true
  }))

  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

// Connect flash
app.use(flash()) 

// Global warning variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.error = req.flash("error")
  next()
});

app.use(express.static(__dirname + '/public'));
app.use(express.static('views'));

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/data', require('./routes/dataRoute'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`))