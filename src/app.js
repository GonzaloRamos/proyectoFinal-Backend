const express = require("express");
const router = require("./routes/index.routes.js");
const passport = require("./middlewares/auth/passport.local");
const app = express();
const MongoStore = require("connect-mongo");
const session = require("express-session");
const {mongoDB} = require("./config/config.index.js");

app.set("view engine", "ejs");
app.use(express.static("./public"));

app.use(
  session({
    store: MongoStore.create({mongoUrl: mongoDB.uri}),
    secret: "login",
    saveUninitialized: false,
    resave: false,
    rollin0g: true,
    // cookie: {
    //   maxAge: 100000,
    // },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(router);

module.exports = app;
