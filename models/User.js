const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    password: String,
    profile: String,
    level: String, // manager, teacher, parent, student
});