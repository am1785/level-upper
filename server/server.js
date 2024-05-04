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

app.use(cors({
  origin: ["http://localhost:5173", "http://192.168.1.8:5173"],
  credentials: true
}));

app.use(express.json());
const dbo = require("./db/conn");

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000, sameSite: "none", httpOnly: true }, // a day
  rolling: true, // resetting cookie expiration to maxage on every response
  // cookie: { maxAge : 15 * 1000, secure: false } // 15 sec
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(require("./routes/tasks"));
app.use(require("./routes/skills"));
app.use(require("./routes/backlog"));
app.use(require("./routes/auth").router);

// start the Express server
app.listen(PORT, async () => {
  await dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${PORT}`);
});