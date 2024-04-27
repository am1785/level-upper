const mongoose = require('mongoose')
const Schema = mongoose.Schema

const inventorySchema = new mongoose.Schema({
    item_name: { type: String, required: true },
    quantity: { type: Number, required: true }
});

const userSchema = new Schema({
    email: {
        type: String,
        required: true
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
    inventory: [inventorySchema]
  }, { timestamps: true });

module.exports = mongoose.model('user', userSchema);