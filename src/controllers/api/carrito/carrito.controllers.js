const {log4js} = require("../../../config/config.index");

const STATUS = require("../../../config/constants/api.constants");
const {carritoDao} = require("../../../models/dao/index");

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

const deleteAllCarritoController = async (req, res) => {
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

const getAllCarritoController = async (req, res) => {
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

const addProductCarritoController = async (req, res) => {
  try {
    const {id, idProducto} = req.params;

    if (!id && !idProducto) {
      throw new Error({
        error: STATUS.BAD_REQUEST,
        message: `No se proporciono ningun id`,
      });
    }
    const [result, addedProduct] = await carritoDao.addProduct(id, idProducto);
    res
      .status(200)
      .json({msg: "Se agrego el producto con exito", result, producto: addedProduct});
  } catch (error) {
    const errorObject = {error: STATUS.BAD_REQUEST, message: error.message};
    res.status(STATUS.INTERNAL_ERROR.code).json(errorObject.message);
  }
};

const deleteProductCarritoController = async (req, res) => {
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

const purchaseCarritoController = async (req, res) => {
  try {
    const {id} = req.params;
    if (!id) {
      throw new Error({
        error: STATUS.BAD_REQUEST,
        message: `No se proporciono ningun id`,
      });
    }
    const [result, purchasedProducts, user] = await carritoDao.purchaseCarrito(id);
    res
      .status(200)
      .json({purchasedProducts, user, msg: `Se realizo la compra con exito`, result});
  } catch (error) {
    const errorObject = {error: STATUS.BAD_REQUEST, message: error.message};
    res.status(STATUS.INTERNAL_ERROR.code).json(errorObject.message);
  }
};

//TODO: Falta las rutas   /:id  -  /:id/productos/:idProducto

module.exports = {
  createCarritoController,
  deleteAllCarritoController,
  getAllCarritoController,
  addProductCarritoController,
  deleteProductCarritoController,
  purchaseCarritoController,
};
