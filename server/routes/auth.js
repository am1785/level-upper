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

    // req.logIn(req.user, function (err) { // <-- Log user in
    //     // return res.json({msg: 'success', user: req.user._id});
    //     return res.redirect('/auth/login/success');
    //  });
// });

router.post('/auth/login', checkUnAuthenticated,
    passport.authenticate('local', {
        successRedirect: "/auth/login/success",
        failureRedirect: "/auth/login/fail"
    })
);

router.get('/auth/login/fail', checkUnAuthenticated, (req, res) => {
    return res.status(403).json({msg: "login failed"});
});

router.get('/auth/login/success', checkAuthenticated, (req, res) => {
    return res.status(200).json({msg: 'success', user: req.user});
});

router.get('/auth/register/success', checkAuthenticated, (req, res) => {
    return res.status(200).json({msg: "success", _id: req.user});
});

router.get('/auth/register/fail', checkUnAuthenticated, (req, res) => {
    return res.status(403).json({msg: "register failed"});
});

router.post('/auth/register', checkUnAuthenticated, async (req, res) => {
    const {userEmail, userPassword} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(userPassword, 10);
        const user = await User.create({email: userEmail.toLowerCase().trim(), password: hashedPassword, points: 0, language: "English", nickname: ""})
        req.logIn(user, function (err) { // <-- Log user in
            if(!err) {
                res.redirect('/auth/register/success');
            } else {
                // console.log(err);
                res.redirect('/auth/register/fail');
            }
         });
    } catch (err) {
        res.status(400).json({msg: "email exists"});
    }
});

function checkAuthenticated(req, res, next) {
/**
 * Check if request object is authenticated via passport session
 * @returns {void} callback to the next function if req IS authenticated
 */
    if (req.isAuthenticated()) {
        console.log(`current user: ${JSON.stringify(req.user.username)}`);
        console.log(`accessing path: ${JSON.stringify(req.path)}`);
        return next();
    }
    // console.log('not logged in');
    return res.status(403).json({msg: "unauthenticated"});
}

function checkUnAuthenticated(req, res, next) {
/**
 * Check if request object is NOT authenticated via passport session
 * @returns {void} callback to the next function if req is NOT authenticated
 */
    if (!req.isAuthenticated()) {
        return next();
    }
    // console.log('already logged in');
    return res.status(403).json({msg: "already authenticated"});
}

// module.exports = router;

module.exports = {
    router: router,
    checkAuth: checkAuthenticated,
    checkNotAuth: checkUnAuthenticated
};