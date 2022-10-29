const express = require('express');
const User = require('../models/User');
const passport = require('passport');
const multer = require('multer');
const cloudinary = require('cloudinary');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });


// Multer setup
const storage = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname);
    }
});

const imageFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

// Cloudinary (online image storage) setup 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// middleware (check login)
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in to do that!');
    res.redirect('/user/login');
};

// Routers

// 

// User routers
router.post('/user/register', upload.single('image'), (req, res) => {
    if (
        req.body.username &&
        req.body.firstname &&
        req.body.lastname &&
        req.body.password &&
        req.body.level
    ) {
        let newUser = new User({
            username: req.body.username,
            firstName: req.body.firstname,
            lastName: req.body.lastname
        });
        if (req.file) {
            cloudinary.uploader.upload(req.file.path, result => {
                newUser.profile = result.secure_url;
                return createUser(newUser, req.body.password, req, res);
            });
        } else {
            // newUser.profile = process.env.DEFAULT_PROFILE_PIC;
            return createUser(newUser, req.body.password, req, res);
        }
    }
});


// Login
router.get('/user/login', csrfProtection, (req, res) => {
    a = {b:3333};
    res.render('users/login', { csrfToken: req.csrfToken() , data: JSON.stringify(a)});
});

module.exports = router;