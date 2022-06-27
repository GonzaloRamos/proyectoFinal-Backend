const {Router} = require("express");
const {
  getAll,
  getById,
} = require("../../../../controllers/productos/productos.controllers");
const routeProductosPublic = Router();

routeProductosPublic.get("/", getAll);
routeProductosPublic.get("/:id?", getById);

module.exports = routeProductosPublic;
