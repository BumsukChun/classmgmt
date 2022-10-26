const express = require('express');
const mongoose = require('mongoose');
const winston = require('./config/winston');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const socket = require('socket.io');
const dotenv = require('dotenv');
const flash = require('connect-flash');
const Post = require('./models/Post');
const User = require('./models/User');
const helmet = require('helmet');
const hpp = require('hpp');

const port = process.env.PORT ||  3000;

const onlineChatUsers = {};

// dotenv config {path: './.env'}
dotenv.config();

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const morgan = require('morgan');
const app = express();

app.set('view enging', 'ejs'); // replace this with react.js later

if(process.env.NODE_ENV === 'production') {
    // app.enable('trust proxy');
    app.use(morgan('combined'));
    app.use(helmet({ contentSecurityPolicy: false}));
    app.use(hpp()); // to protect against HTTP Parameter Pollution attacks
} else {
    app.use(morgan('dev'));
    console.log('===== DEV mode ======');
}

// middleware
app.use(cookieParser(process.env.SESSION_SECRET));
// You need to make your own SESSIN_SECRET key in .env file, .gitignore file will handle it not to be included.
const sessOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: 
        {
            httpOnly: true,
            secure: false
        }
};

if (process.env.NODE_ENV === 'production') {
    // sessOptions.proxy = true;
    // sessOptions.cookie.secure = true;
}

app.use(session(sessOptions));
app.use(flash());
// The flash is a special area of the session used for storing messages.
// flash uses cookie-parser and express-session, so it should be after them.

// passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB Connection (URI in the env file, and you can use local or remote address)
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        //useCreatIndex: true, // deprecated
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to MongoDB !!');
    }).catch((err) => {
        winston.error(err);
    });

// to Template file, transfer variables
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.login = req.isAuthenticated();
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success !!');
    next();
});

// Routers
app.use('/', userRoutes);
app.use('/', postRoutes);

const server = app.listen(port, () => {
    // instead of console.log('App is running on .... ');
    winston.info(`App is running on port ${port}`);
});

// WebSocket part ... use LATER when I need it.