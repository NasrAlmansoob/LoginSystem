const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const passport = require('passport');

const app = express();
//DB config
const db = require('./config/keys').MongoURI;

//Passport config
require('./config/passport')(passport);

mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err));



//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');


//BodyParser
app.use(express.urlencoded({extended: false}));


//Express Session
app.use(session({
    secret: 'secret',
    resave: 'true',
    saveUninitialized: true
}));

//Passport 
app.use(passport.initialize());
app.use(passport.session());

// Use flash
app.use(flash());


// Global Vars
app.use((req,res,next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})
app.use('/', require('./routes/router'));
app.use('/users', require('./routes/users'))


app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', (req,res) => {
    var username = req.params.username;
    var password = req.params.password;
    if(username && password){
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', username,password , (error, results, fields) => {
            if(results.length > 0){
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/');
            } else {
                res.send('Incorrect Username and/or Password');
            }
            res.end();
    });
} else {
    res.send('Please enter Username and Password');
    res.end();
}
});

app.get('/home', (req, res) => {
    if(req.session.loggedin){
        res.send('Welcome back ' + req.session.username + '!');
    }else {
        res.send('Please login to view this page!');
    }
    res.send();
});



const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
