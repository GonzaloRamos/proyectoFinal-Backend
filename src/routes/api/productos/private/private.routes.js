const express = require("express");
const {
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../../../../controllers/productos/productos.controllers");
const MulterUpload = require("../../../../middlewares/multer/multer.upload");
const upload = new MulterUpload("products").upload();

const routerProductosPrivate = express.Router();

routerProductosPrivate.post("/", upload.single("image"), addProduct);

routerProductosPrivate.put("/:id?", updateProduct);

routerProductosPrivate.delete("/delete", deleteProduct);

module.exports = routerProductosPrivate;
