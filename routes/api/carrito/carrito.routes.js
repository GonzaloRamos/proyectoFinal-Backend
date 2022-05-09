const {Router} = require("express");
const {controllers} = require("../../../constants/routes.js");
const {
  addProduct,
  createCarritoController,
  deleteAll,
  deleteProduct,
  getAll,
  purchase,
} = require(controllers.apiCarrito);

const routeCarrito = Router();

routeCarrito.post("/", createCarritoController);

routeCarrito.delete("/:id?", deleteAll);

routeCarrito.delete("/:id?/productos/:idProducto", deleteProduct);

routeCarrito.get("/:id?/productos", getAll);

routeCarrito.post("/:id?/productos/:idProducto", addProduct);

routeCarrito.post("/:id/purchase", purchase);

module.exports = routeCarrito;
