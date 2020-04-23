require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts')

const app = express();
app.use(express.static('uploads'));
// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

//Bodyparser
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: false}))

app.use(express.static(__dirname + '/public'));
app.use(express.static('views'));

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/data', require('./routes/dataRoute'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`))