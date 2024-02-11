const mongoose = require('mongoose')
const Schema = mongoose.Schema

const skillSchema = new mongoose.Schema({
    skill_name: { type: String, required: true },
    tasks_completed: { type: Number, required: true },
    exp_earned: { type: Number, required: true }
});

const skillsetSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    total_exp: {
        type: Number,
        required: true,
    },
    skills: [skillSchema]
  })

module.exports = mongoose.model('skillset', skillsetSchema);