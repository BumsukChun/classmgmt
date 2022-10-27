const express = require('express');
const mongoose = require('mongoose');
const winston = require('./config/winston');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const socket = require('socket.io');
const dotenv = require('dotenv');
const flash = require('connect-flash'); // show messages
// const Post = require('./models/Post');
const User = require('./models/User');
const helmet = require('helmet');
const hpp = require('hpp');

const port = process.env.PORT || 3000;
dotenv.config();

const userRoutes = require('./routes/users');
const morgan = require('morgan');
const { initialize } = require('passport');
const app = express();

app.set('view engine', 'ejs');

if (process.env.NODE_ENV == 'production') {
    // app.enable('trust proxy');
    app.use(morgan('combined'));
    app.use(helmet({ contentSecurityPolicy: false}));
    app.use(hpp());
} else {
    app.use(morgan('dev'));
}

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
app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

// to Template file, transfer variables
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.login = req.isAuthenticated();
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success!');
    next();
});

// Routers
// app.use('/', userRoutes);
// app.use('/', postRoutes);
app.get('/', (req, res) => {
    res.send('HAHAHA');
});

// Server listening
const server = app.listen(port, () => {
    winston.info(`node server is running at port ${port}`);
});