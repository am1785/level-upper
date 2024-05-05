const mongoose = require('mongoose')
const Schema = mongoose.Schema

const inventorySchema = new mongoose.Schema({
    item_name: { type: String, required: true },
    quantity: { type: Number, required: true }
});

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
    },
    language: {
        type: String,
    },
    points: {
        type: Number,
    },
    role: { // 4 = site admin, 3 = moderator, 2 = elevated user, 1 = normal user
        type: Number,
        required: true
    },
    inventory: [inventorySchema]
  }, { timestamps: true });

module.exports = mongoose.model('user', userSchema);