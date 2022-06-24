const {Router} = require("express");
const {
  addProduct,
  createCarritoController,
  deleteAll,
  deleteProduct,
  getAll,
  purchase,
} = require("../../../controllers/api/carrito/carrito.controllers");

const routeCarrito = Router();

routeCarrito.post("/", createCarritoController);

routeCarrito.delete("/:id?", deleteAll);

routeCarrito.delete("/:id?/productos/:idProducto", deleteProduct);

routeCarrito.get("/:id?/productos", getAll);

routeCarrito.post("/:id?/productos/:idProducto", addProduct);

routeCarrito.post("/:id/purchase", purchase);

module.exports = routeCarrito;
