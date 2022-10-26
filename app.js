const express = require('express');
const mongoose = require('mongoose');
const winston = require('./config/winston');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv');

const port = process.env.PORT || 3000;
dotenv.config();

const app = express();


// middleware
app.use(cookieParser(process.env.SESSION_SECRET)); // ##### YOU NEED expire TIME here later ##### 
const sessOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:
        {
            httpOnly: true,
            secure: false
        }
}

if (process.env.NODE_ENV === 'production') {
    // sessOptions.proxy = true;
    // sessOptions.cookie.secure = true;
}

app.use(session(sessOptions));

// passport


// express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// MongoDB Connection
mongoose
    .connect('mongodb://localhost:27017/classmgmt',{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to MongoDB ...');
    })
    .catch((err) => {
        winston.error(err);
    });

// Routers
app.get('/', (req, res) => {
    res.send('HAHAHA');
});

// Server listening
const server = app.listen(port, () => {
    winston.info(`node server is running at port ${port}`);
});