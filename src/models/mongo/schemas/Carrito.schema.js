const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Carrito = new Schema({
  timeStamp: {type: Number, default: new Date().getTime()},
  products: [{type: Schema.Types.ObjectId, ref: "products"}],
  isEmpty: {type: Boolean, default: true},
  purchased: {type: Boolean, default: false},
  user: {type: Schema.Types.ObjectId, ref: "user"},
});

module.exports = Carrito;
