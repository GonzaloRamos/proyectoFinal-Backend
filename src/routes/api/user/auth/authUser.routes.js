const {Router} = require("express");
const {
  createUserController,
  loginController,
  logoutController,
} = require("../../../../controllers/api/users/users.controllers");
const passport = require("../../../../middlewares/auth/passport.local");
const MulterUpload = require("../../../../middlewares/multer/multer.upload");
const upload = new MulterUpload("users").upload();
const authUserRoutes = Router();

authUserRoutes.post("/register", upload.single("photo"), createUserController);
authUserRoutes.post(
  "/login",
  passport.authenticate("login", {
    failureMessage: true,
    successMessage: true,
  }),
  loginController
);

authUserRoutes.post("/logout", logoutController);

module.exports = authUserRoutes;
