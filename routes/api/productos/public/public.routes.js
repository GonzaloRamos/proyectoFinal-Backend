const {Router} = require("express");
const {controllers} = require("../../../../constants/routes.js");
const {getAll, getById} = require(controllers.apiProducts);
const routeProductosPublic = Router();

routeProductosPublic.get("/", getAll);
routeProductosPublic.get("/:id?", getById);

module.exports = routeProductosPublic;
