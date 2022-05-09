const {log4js} = require("../../../config/config");
const {userDao, carritoDao} = require("../../../models/dao");
const Utils = require("../../../utils/Utils");

/**
 * Controller para la creación de un usuario.
 * En este mismo momento se le crea un carrito asociado al usuario.
 * @param {*} req Express request object
 * @param {*} res Express response object
 */
const createUserController = async (req, res) => {
  try {
    //Creo el ususario, le paso los parámetros que me llegaron por POST.
    //El password se encripta en el modelo.
    //Req.file se encuentra los archivos a subir.
    const user = await userDao.createUser(req.body, req.file);
    //Envio notificación de creación de usuario.
    await userDao.sendMail(user);

    //Creo el carrito asociado al usuario.
    await carritoDao.createCarrito(user._id);

    //Redirigo al usuario a la página de inicio de login.
    res.redirect("/login-register");
  } catch (error) {
    //En caso de error imprimo el error
    log4js.errorLogger.error(error.message);
    res.render("pages/error/error.ejs", {error: error.message});
  }
};

/**
 * Lo único que se hace es redirigir al usuario a la página de inicio.
 * La validación de autenticación se hace en el middleware apiAuth.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const loginSuccessController = (req, res) => {
  res.redirect("/");
};

/**
 * Ejecuta la funcion de logoutController del usuario. Se encarga passport local de hacerlo.
 * Se redirige al usuario a la página de inicio.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logoutController = (req, res) => {
  req.logout();
  res.redirect("/");
};

/**
 * Elimina un usuario de la base de datos. Se encarga de llamar al Dao de ususarios para eliminarlo.
 * Redirecciona al usuario a la página de administrador.
 * En caso de error muestra la pagina de error.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteUserController = async (req, res) => {
  try {
    if (!Utils.objectHasValues(req.body)) {
      throw new Error("No se encontro información en la petición");
    }
    await userDao.deleteUser(req.body);
    res.redirect("/admin-panel");
  } catch (error) {
    log4js.errorLogger.error(error.message);
    res.render("pages/error/error.ejs", {error: error.message});
  }
};
module.exports = {
  createUserController,
  loginSuccessController,
  logoutController,
  deleteUserController,
};
