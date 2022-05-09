const {Router} = require("express");
const {
  createUserController,
  loginSuccessController,
  logoutController,
} = require("../../../../controllers/api/users/users.controllers");
const passport = require("../../../../middlewares/auth/passport.local");
const upload = require("../../../../middlewares/multer/multer.upload");
const authUserRoutes = Router();

authUserRoutes.post("/register", upload.single("photo"), createUserController);
authUserRoutes.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/login-register",
    failureMessage: true,
  }),
  loginSuccessController
);

authUserRoutes.post("/logout", logoutController);

module.exports = authUserRoutes;
