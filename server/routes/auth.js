const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const User = require('../models/user');

// router.post('/auth/login',
//     passport.authenticate('local', {failureRedirect: "/auth/login/fail"}), function (req, res) {
//     // If this function gets called, authentication was successful.
//     // passport by default sends 401 and terminates additional route handlers if auth fails.
//     // `req.user` contains the authenticated user.
//     // Then you can send your json as response.

//     // all this only worked after fixing serializeUser & deserializeUser
//     // console.log(`isAuthenticated: ${req.isAuthenticated()},sesh_id: ${req.sessionID}`)

//     // res.setHeader('Access-Control-Allow-Credentials', 'true');
//     // return res.json({msg: 'success', user: req.user._id, sesh: req.session});

//     // console.log(`is auth: ${req.isAuthenticated()}`);
//     // return res.json({msg: 'success', user: req.user});

//     req.logIn(req.user, function (err) { // <-- Log user in
//         // return res.json({msg: 'success', user: req.user._id});
//         return res.redirect('/auth/login/success');
//      });
// });

router.post('/auth/login',
    passport.authenticate('local', {
        successRedirect: "/auth/login/success",
        failureRedirect: "/auth/login/fail"
    })
);

router.get('/auth/login/fail', (req, res) => {
    return res.status(401).json({msg: "login failed"});
});

router.get('/auth/login/success', (req, res) => {
    return res.status(200).json({msg: 'success', user: req.user});
});

// router.post('/auth/login', (req, res, next) => {
//     passport.authenticate('local', (err, user, info) => {
//       if (err) {
//         return next(err);
//       }

//       if (!user) {
//         // Authentication failed
//         return res.status(401).json(info);
//       }

//       // Authentication succeeded
//     return res.json({message: "success", id: user._id});
//     })(req, res, next);
// });


router.post('/auth/register', async (req, res) => {
    console.log(`is auth: ${req.isAuthenticated()}`);
    const {userEmail, userPassword} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(userPassword, 10);
        const user = await User.create({email: userEmail.toLowerCase().trim(), password: hashedPassword, points: 0, language: "English", })
        req.logIn(user);
        res.status(200).json({msg: "success", _id: user._id});
    } catch (err) {
        res.status(400).json({msg: "email exists"});
    }
});

module.exports = router;