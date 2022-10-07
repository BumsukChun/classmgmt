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

