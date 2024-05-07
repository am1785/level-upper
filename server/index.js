const express = require("express");
const cors = require("cors");

// passport set up
const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./config/passport');
initializePassport(passport);

// app set up
require("dotenv").config({path: "./app_config.env"})
const PORT = process.env.PORT || 5001;

const app = express();

// configure app for cross-domain
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
       res.send(200);
   } else {
       next();
   }
  });

// use callback function to dynamically capture all CORS routes

// const whitelist = ['https://level-upper.vercel.app'];
const whitelist = process.env.WHITELISTED_DOMAINS.split(' ');
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.some(url => origin.startsWith(url))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  preflightContinue: true,
};

app.use(cors(corsOptions));

app.use(express.json());

// const dbo = require("./db/conn");
const dbConnect = require("./db/conn");

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000, sameSite: "none", httpOnly: true, secure: false }, // a day
  rolling: true, // resetting cookie expiration to maxage on every response
  // cookie: { maxAge : 15 * 1000, secure: false } // 15 sec
  proxy: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(require("./routes/tasks"));
app.use(require("./routes/skills"));
app.use(require("./routes/backlog"));
app.use(require("./routes/users"));
app.use(require("./routes/auth").router);

console.log(`Server is about to run`);

// start the Express server
// app.listen(PORT, async () => {
//   await dbo.connectToServer(function (err) {
//     if (err) console.error(err);
//   });
//   console.log(`Server is running on port: ${PORT}`);
// });

app.listen(PORT, async () => {
  await dbConnect();
  console.log(`Server is running on port: ${PORT}`);
});

// module.exports = app; // for vercel's serverless environment