const passport = require("passport");
const {log4js} = require("../../config/config.index");
const ApiUtils = require("../../utils/Utils.api");
const LocalStrategy = require("passport-local").Strategy;
const {userDao} = require("../../models/dao/index");

passport.use(
  "login",
  new LocalStrategy((username, password, done) => {
    userDao
      .getUserByFilter({username})
      .then((user) => {
        if (!ApiUtils.isValidPassword(user, password)) {
          const errorMessage = "Contraseña incorrecta";
          return done(errorMessage, false);
        }
        return done(null, user);
      })
      .catch((error) => {
        return done(error, false);
      });
  })
);

passport.serializeUser((user, done) => {
  log4js.consoleLogger.info("Inside serializer");
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  log4js.consoleLogger.info("Inside deserializer");
  userDao.getById(id).then((user) => {
    done(null, user);
  });
});

module.exports = passport;
