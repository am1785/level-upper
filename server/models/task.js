const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: false,
    },
    skills: [{type: String}],
    status: {
        // type: Number, enum: [-1, 0, 1],
        type: String,
        required: true,
    }, // ongoing = 0, backlog = -1, completed = 1
    exp: {
        type: Number,
        required: true,
    },
    recurring: {
        type: Boolean,
        default: false
    },
    author: {
        type: String,
        required: true
    }
  }, { timestamps: true });

module.exports = mongoose.model('task', taskSchema);