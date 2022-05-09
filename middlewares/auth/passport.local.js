const passport = require("passport");
const {log4js} = require("../../config/config");
const {models, utils} = require("../../constants/routes");
const ApiUtils = require(utils.apiUtils);
const LocalStrategy = require("passport-local").Strategy;
const {userDao} = require(models.indexDao);

passport.use(
  "login",
  new LocalStrategy((username, password, done) => {
    userDao
      .getByFilter({username})
      .then((user) => {
        if (!ApiUtils.isValidPassword(user, password)) {
          console.log("Invalid password");
          return done(null, false);
        }
        return done(null, user);
      })
      .catch((error) => {
        return done(error);
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
