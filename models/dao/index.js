const {config, models} = require("../../constants/routes");
const {DATABASE_TO_USE} = require(config);
let productDao;
let carritoDao;
let userDao;

if (DATABASE_TO_USE === "mongoDB") {
  const CarritoDao = require(models.mongo.carritoDao);
  const ProductDao = require(models.mongo.productosDao);
  const UserDao = require(models.mongo.userDao);
  productDao = new ProductDao();
  carritoDao = new CarritoDao();
  userDao = new UserDao();
}

module.exports = {carritoDao, productDao, userDao};
