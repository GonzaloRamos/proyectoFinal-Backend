const userRoutes = require("express").Router();

//Import controller
const {deleteUserController} = require("../../../controllers/users/users.controllers");

//Middleware de autenticación
const apiAuth = require("../../../middlewares/auth/auth.user");

const authUserRoutes = require("./auth/authUser.routes");

userRoutes.use("/auth", authUserRoutes);

userRoutes.delete("/delete", apiAuth, deleteUserController);

module.exports = userRoutes;
