const mongoose = require('mongoose');

let ClassSchema = new mongoose.Schema({
    room_number: String,
    class_code: String,
    subject_code: String,
    description: String,
    likes: Number,
    teacher: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // teacher
        }, 
        firstName: String, 
        lastName: String
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    homeworks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Homework'
        }
    ],
    timetables: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Timetable'
        }
    ]
});

let Class = mongoose.model('Class', ClassSchema);

module.exports = Class;

// teacher, room_number, subject_code, class_code, students, homeworks, time_talbe