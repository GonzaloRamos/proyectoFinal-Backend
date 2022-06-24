const STATUS = require("../../../config/constants/api.constants");
const Utils = require("../../../utils/Utils");
const {productDao} = require("../../../models/dao/index");

/**
 * Busca todos los productos
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Array} - Array of products
 */
const getAll = async (req, res) => {
  try {
    const allProducts = await productDao.getAllProducts();
    return res.status(200).json(allProducts);
  } catch (error) {
    res
      .status(STATUS.INTERNAL_ERROR.code)
      .json({error: STATUS.INTERNAL_ERROR, message: error.message});
  }
};

const getById = async (req, res) => {
  try {
    const {id} = req.params;
    if (!id) {
      throw new Error("No se proporciono ningun id");
    }

    const product = await productDao.getProductById(id);
    res.status(STATUS.OK.code).json(product);
  } catch (error) {
    res
      .status(STATUS.BAD_REQUEST.code)
      .json({error: STATUS.BAD_REQUEST, message: error.message});
  }
};

const addProduct = async (req, res) => {
  try {
    const notEmpty = Utils.objectHasValues(req.body);
    if (!notEmpty) {
      throw new Error("No hay data en la request");
    }
    const result = await productDao.add(req.body, req.file);
    return res.status(STATUS.CREATED.code).json(result);
  } catch (error) {
    res
      .status(STATUS.BAD_REQUEST.code)
      .json({error: STATUS.BAD_REQUEST, message: error.message});
  }
};

const updateProduct = async (req, res) => {
  try {
    const {id} = req.params;
    if (!id) {
      throw new Error(`No se proporciono ningun id`);
    }
    if (!req.body) {
      throw new Error(`No se recibio nada en la petición HTTP`);
    }
    const result = await productDao.updateProduct(id, req.body);
    res.status(STATUS.CREATED.code).json({message: "Se actualizo correctamente", result});
  } catch (error) {
    res
      .status(STATUS.BAD_REQUEST.code)
      .json({error: STATUS.BAD_REQUEST, message: error.message});
  }
};

const deleteProduct = async (req, res) => {
  try {
    const result = await productDao.deleteProduct(req.body);
    res
      .status(STATUS.OK.code)
      .json({message: `Se elimino el registro con id ${req.body._id}`, result});
  } catch (error) {
    res
      .status(STATUS.BAD_REQUEST.code)
      .json({error: STATUS.BAD_REQUEST, message: error.message});
  }
};

module.exports = {
  getAll,
  getById,
  addProduct,
  updateProduct,
  deleteProduct,
};
