const {DATABASE_TO_USE} = require("../../config/config.index");

let productDao;
let carritoDao;
let userDao;

if (DATABASE_TO_USE === "mongoDB") {
  const CarritoDao = require("./carrito/carritoMongo.dao");
  const ProductDao = require("./productos/productosMongo.dao");
  const UserDao = require("./user/userMongo.dao");
  productDao = new ProductDao();
  carritoDao = new CarritoDao();
  userDao = new UserDao();
} else {
  const CarritoDao = require("./carrito/carritoFs.dao");
  const ProductDao = require("./productos/productosFs.dao");
  const UserDao = require("./user/userMongo.dao");
  productDao = new ProductDao();
  carritoDao = new CarritoDao();
  userDao = new UserDao();
}

module.exports = {carritoDao, productDao, userDao};
