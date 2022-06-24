const {log4js} = require("../../../config/config.index");
const {userDao, carritoDao} = require("../../../models/dao");
const Utils = require("../../../utils/Utils");
/**
 * Controller para la creación de un usuario.
 * En este mismo momento se le crea un carrito asociado al usuario.
 * @param {Object} req Express request object
 * @param {Object} res Express response object
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

    //Mando respuesta de log success
    res.status(201).json({
      msg: "Usuario creado con exito",
      id: user._id,
      email: user.email,
      username: user.username,
      name: user.name,
      lastname: user.lastname,
    });
  } catch (error) {
    //En caso de error imprimo el error
    log4js.errorLogger.error(error.message);
    res.status(500).json({error: error.message});
  }
};

/**
 * Lo único que se hace es redirigir al usuario a la página de inicio.
 * La validación de autenticación se hace en el middleware apiAuth.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

const loginController = (req, res) => {
  res.status(200).json({msg: "Usuario autenticado con exito"});
};

/**
 * Ejecuta la funcion de logoutController del usuario. Se encarga passport local de hacerlo.
 * Se redirige al usuario a la página de inicio.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logoutController = (req, res) => {
  req.logout();
  res.status(200).json({msg: "Usuario deslogueado con exito"});
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

    //TODO: Traer el usuario de la base de datos antes de eliminarlo para poder mostrar su información en los mensajes correspondientes.
    await userDao.deleteUser(req.body);
    res.status(200).json({msg: "Se elimino el usuario con exito"});
  } catch (error) {
    log4js.errorLogger.error(error.message);
    res.status(404).json({error: error.message});
  }
};
module.exports = {
  createUserController,
  loginController,
  logoutController,
  deleteUserController,
};
