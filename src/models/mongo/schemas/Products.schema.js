const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**construyendo schemas */
const Products = new Schema({
  name: {type: String, required: [true, "Debe contener un nombre"], minlength: 3},
  price: {
    type: Number,
    required: true,
    min: [100, "El precio no puede ser menor que 100"],
  },
  onSale: {type: Boolean, default: false},
  stock: {type: Number, min: [0, "El stock no puede ser menor que 0"], default: 0},
  description: {type: String, required: [true, "Debe tener una descripción"]},
  image: {type: String, required: [true, "Debe contener una imagen"]},
  timestamp: {type: Number, default: new Date().getTime()},
  createdAt: {type: Date, default: new Date()},
});

module.exports = Products;
