const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {type: String, required: true},
  lastname: {type: String, required: true},
  age: {type: Number, required: true},
  username: {type: String, required: true, unique: true},
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Invalid email"],
  },
  address: {type: String, required: true},
  phone: {type: Number, required: true},
  photo: {type: String, default: "assets/images/users/no-user-image.jpg"},
  password: {type: String, required: true, unique: true},
  createdAt: {type: Date, default: new Date()},
  admin: {type: Boolean, default: false},
});

module.exports = UserSchema;
