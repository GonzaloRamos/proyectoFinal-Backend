const {getPath} = require("../utils/Utils");

const baseControllersApi = ["controllers", "api"];
const baseSchema = ["models", "mongo", "schemas"];
const baseDao = ["models", "dao"];
/**
 * Contenedor que tiene todas las rutas del aplicativo.
 */
const routes = {
  controllers: {
    apiCarrito: getPath([...baseControllersApi, "carrito", "carrito.controllers.js"]),
    apiProducts: getPath([
      ...baseControllersApi,
      "productos",
      "productos.controllers.js",
    ]),
  },
  statusCodes: getPath(["constants", "api.constants.js"]),
  models: {
    fs: {
      main: getPath(["models", "fileSystem", "FileSystem.js"]),
      carritoDao: getPath([...baseDao, "carrito", "carritoFs.dao.js"]),
      productosDao: getPath([...baseDao, "productos", "productosFs.dao.js"]),
    },
    mongo: {
      main: getPath(["models", "mongo", "MongoDB.js"]),
      schemas: {
        carrito: getPath([...baseSchema, "Carrito.schema.js"]),
        productos: getPath([...baseSchema, "Products.schema.js"]),
        user: getPath([...baseSchema, "User.schema.js"]),
      },
      productosDao: getPath([...baseDao, "productos", "productosMongo.dao.js"]),
      carritoDao: getPath([...baseDao, "carrito", "carritoMongo.dao.js"]),
      userDao: getPath([...baseDao, "user", "userMongo.dao.js"]),
    },
    indexDao: getPath([...baseDao, "index.js"]),
  },
  DB: getPath(["data"]),
  utils: {
    main: getPath(["utils", "Utils.js"]),
    apiUtils: getPath(["utils", "Utils.api.js"]),
  },
  config: getPath(["config", "config.js"]),
};

module.exports = routes;
