const {Router} = require("express");
const {
  addProductCarritoController,
  createCarritoController,
  deleteAllCarritoController,
  deleteProductCarritoController,
  getAllCarritoController,
  purchaseCarritoController,
} = require("../../../controllers/carrito/carrito.controllers");

const routeCarrito = Router();

routeCarrito.post("/", createCarritoController);

routeCarrito.delete("/:id", deleteAllCarritoController);

routeCarrito.delete("/:id/productos/:idProducto", deleteProductCarritoController);

routeCarrito.get("/:id/productos", getAllCarritoController);

routeCarrito.post("/:id/productos/:idProducto", addProductCarritoController);

routeCarrito.post("/:id/purchase", purchaseCarritoController);

module.exports = routeCarrito;
