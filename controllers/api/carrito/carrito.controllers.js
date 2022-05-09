const {log4js} = require("../../../config/config");
const {statusCodes, models} = require("../../../constants/routes");
const STATUS = require(statusCodes);
const {carritoDao} = require(models.indexDao);

//Este controlador no esta incoporador a las rutas de las páginas. Devuelven json con los datos se puede probar con postman.

const createCarritoController = async (req, res) => {
  try {
    const carrito = await carritoDao.createCarrito(req.body);
    return res.status(200).json(carrito);
  } catch (error) {
    const errorObject = {error: STATUS.INTERNAL_ERROR, message: error.message};
    log4js.errorLogger.error(errorObject);
    res.status(STATUS.INTERNAL_ERROR.code).json(errorObject.message);
  }
};

const deleteAll = async (req, res) => {
  try {
    const {id} = req.params;
    if (!id) {
      throw new Error("No se especifico un id");
    }

    const deletedCarrito = await carritoDao.deleteCarrito(id);
    res
      .status(STATUS.OK.code)
      .json({deletedCarrito, message: `Se elimino el carrito con id ${id}`});
  } catch (error) {
    const errorObject = {error: STATUS.BAD_REQUEST, message: error.message};
    log4js.errorLogger.error(errorObject);
    res.status(STATUS.BAD_REQUEST.code).json(errorObject);
  }
};

const getAll = async (req, res) => {
  try {
    const {id} = req.params;
    if (!id) {
      throw new Error(`No se proporciono ningun id`);
    }
    const productos = await carritoDao.getAllProducts(id);
    res.status(200).json(productos);
  } catch (error) {
    const errorObject = {error: STATUS.BAD_REQUEST, message: error.message};
    log4js.errorLogger.error(errorObject);
    res
      .status(STATUS.BAD_REQUEST.code)
      .json({error: STATUS.BAD_REQUEST, message: error.message});
  }
};

const addProduct = async (req, res) => {
  try {
    const {id, idProducto} = req.params;

    if (!id && !idProducto) {
      throw new Error({
        error: STATUS.BAD_REQUEST,
        message: `No se proporciono ningun id`,
      });
    }
    const result = await carritoDao.addProduct(id, idProducto);
    console.log(result);
    res.redirect("/");
  } catch (error) {
    const errorObject = {error: STATUS.BAD_REQUEST, message: error.message};
    res.status(STATUS.INTERNAL_ERROR.code).json(errorObject.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const {id, idProducto} = req.params;
    if (!id && !idProducto) {
      throw new Error({
        error: STATUS.BAD_REQUEST,
        message: `No se proporciono ningun id`,
      });
    }
    const result = await carritoDao.deleteProduct(id, idProducto);
    res
      .status(STATUS.OK.code)
      .json({...result, message: `Se elimino correctamente el producto`});
  } catch (error) {
    const errorObject = {error: STATUS.BAD_REQUEST, message: error.message};
    res.status(STATUS.INTERNAL_ERROR.code).json(errorObject.message);
  }
};

const purchase = async (req, res) => {
  try {
    const {id} = req.params;
    if (!id) {
      throw new Error({
        error: STATUS.BAD_REQUEST,
        message: `No se proporciono ningun id`,
      });
    }
    await carritoDao.purchaseCarrito(id);
    res.redirect("/");
  } catch (error) {
    const errorObject = {error: STATUS.BAD_REQUEST, message: error.message};
    res.status(STATUS.INTERNAL_ERROR.code).json(errorObject.message);
  }
};

module.exports = {
  createCarritoController,
  deleteAll,
  getAll,
  addProduct,
  deleteProduct,
  purchase,
};
