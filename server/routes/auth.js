const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require('../models/user');

router.post('/register', async (req, res) => {
    const {userEmail, userPassword} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(userPassword, 10);
        const user = await User.create({email: userEmail.toLowerCase().trim(), password: hashedPassword, points: 0, language: "English", })
        res.status(200).json({msg: "success"});
    } catch (err) {
        res.status(400).json({msg: "email exists"});
    }
});

module.exports = router;