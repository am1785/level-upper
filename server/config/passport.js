const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

// getting user by email query function
const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({email: email})
        return user;
    } catch (err) {
        return null;
    }
}

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email);
        if (user == null) {
            // console.log('no user found');
            return done(null, false, {message: "user with email not found"});
        }

        // if there is a user with provided email address, compare hash of password
        try {
            if (await bcrypt.compare(password, user.password)) {
                // console.log('log in successful');
                return done(null, user);
            } else {
                // console.log('incorrect password');
                return done(null, false, {message: "incorrect password"});
            }
        } catch (e) {
            return done(e);
        }
    }

    passport.use(new LocalStrategy( {usernameField: 'userEmail', passwordField: 'userPassword'}, authenticateUser));
    passport.serializeUser((user, done) => {
        // console.log('serializing');
        done(null, {id: user._id, username: user.email, nickname: user.nickname, language: user.language, createdAt: user.createdAt, points: user.points, inventory: user.inventory, role: user.role});
    });

    passport.deserializeUser( async (user, done) => {
        // User.findById(user.id, (err, user) => {
        //     // console.log(done(err, user));
        //     console.log("deserializing");
        //     return done(null, user);
        // })
        // console.log('deserialing');
        // console.log(user);
        // const u = await User.findOne({_id: user.id});
        return done(null, user);
    });
}


module.exports = initialize