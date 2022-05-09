const {log4js} = require("../../config/config");
const {productDao, userDao, carritoDao} = require("../../models/dao/index");

const indexController = async (req, res) => {
  try {
    //Reviso si el usuario esta autenticado y me traigo los productos de la base de datos.
    const isLogged = req.isAuthenticated();
    const products = await productDao.getAllProducts();

    //Si no esta autenticado mando los productos sin usuario
    if (!isLogged) {
      return res.render("pages/index.ejs", {
        products,
        user: false,
        carrito: false,
      });
    }

    //Si esta autenticado me traigo el usuario
    const user = await userDao.getUserById(req.user.id);

    //Si el usuario no es administrador mando el carrito
    if (!user.admin) {
      const carrito = await carritoDao.populateCarrito(
        await carritoDao.getCarritoByUser(user._id),
        {path: "products"}
      );

      return res.render("pages/index.ejs", {products, user, carrito});
    }

    //Si es administrador no mando el carrito
    return res.render("pages/index.ejs", {products, user, carrito: false});
  } catch (error) {
    log4js.errorLogger.error(error.message);
    res.render("pages/error/error.ejs", {error: error.message});
  }
};

/**
 * Controller para el panel de administracion. En caso que el ususario no sea administrador se redirige a la página de inicio. Debe recibir dos actions mediante URL: users o products.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const adminPanelController = async (req, res) => {
  try {
    const user = await userDao.getUserById(req.user.id);
    const userIsAdmin = await userDao.userIsAdmin(req.user.id);

    if (!userIsAdmin) {
      return res.redirect("/");
    }
    const {action} = req.params;
    if (action === "products") {
      const products = await productDao.getAll();
      return res.render("pages/user/admin/admin-panel.ejs", {
        products,
        user,
        action: "products",
      });
    }
    if (action === "users") {
      const allUsers = await userDao.getAllUsers();
      return res.render("pages/user/admin/admin-panel.ejs", {
        allUsers,
        user,
        action: "users",
      });
    }

    return res.render("pages/error/error.ejs", {
      error: '"action" no es una accion valida o no se recibio ninguna action',
    });
  } catch (error) {
    log4js.errorLogger.error(error.message);
    res.render("pages/error/error.ejs", {error: error.message});
  }
};

const loginRegisterController = (req, res) => {
  res.render("pages/user/login-register.ejs", {user: false});
};

module.exports = {indexController, adminPanelController, loginRegisterController};
