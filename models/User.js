const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    teacher_code: String,
    studentNumber: String,
    mobile_phone: String, // when needed 
    schoolName:String,
    email: String, // for recover password
    password: String,
    profile: String, // description of the user
    user_level: String, // manager, teacher, parent, student
    teacher_level: String, // you can create levels ... principal, senior, junior...
    student_level: String, // you can create levels ... 1st, 2nd, 3rd grade ...

    classes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class" // only teacher can create ...
        }
    ],

    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message" // only teacher can create ...
        }
    ],

    tests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Test" // only teacher can create ...
        }
    ],

    homeworks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Homework" // only teacher can create ...
        }
    ],

    teachers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" // student, parents sharing ... 
        }
    ],

    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" // teacher, parents sharing ...
        }
    ],

    parents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" // teacher, student sharing ...
        }
    ],
});

UserSchema.plugin(passportLocalMongoose);
let User = mongoose.model('Manager', UserSchema);
module.exports = User;