const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const User = require('../models/user');

// router.post('/auth/login',
//     passport.authenticate('local', {failureMessage: true}), function (req, res) {
//     // If this function gets called, authentication was successful.
//     // passport by default sends 401 and terminates additional route handlers if auth fails.
//     // `req.user` contains the authenticated user.
//     // Then you can send your json as response.
//     console.log('success from route!!');
//     return res.json(req.userEmail);
// })

router.post('/auth/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        // Authentication failed
        return res.status(401).json(info);
      }

      // Authentication succeeded
    return res.json({message: "success", id: user._id});
    })(req, res, next);
});


router.post('/auth/register', async (req, res) => {
    const {userEmail, userPassword} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(userPassword, 10);
        const user = await User.create({email: userEmail.toLowerCase().trim(), password: hashedPassword, points: 0, language: "English", })
        res.status(200).json({msg: "success", _id: user._id});
    } catch (err) {
        res.status(400).json({msg: "email exists"});
    }
});

module.exports = router;