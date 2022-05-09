const express = require("express");
const {controllers} = require("../../../../constants/routes.js");
const {addProduct, updateProduct, deleteProduct} = require(controllers.apiProducts);

const routerProductosPrivate = express.Router();

routerProductosPrivate.post("/", addProduct);

routerProductosPrivate.put("/:id?", updateProduct);

routerProductosPrivate.delete("/delete", deleteProduct);

module.exports = routerProductosPrivate;
