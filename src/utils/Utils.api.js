const {v4: uuidv4} = require("uuid");
const Utils = require("../utils/Utils");
const bCrypt = require("bcrypt");

class ApiUtils extends Utils {
  static getCarritoForDBFileSystem() {
    const carrito = {
      id: uuidv4(),
      timeStamp: Date.now(),
      products: [],
      isEmpty: true,
      isPurchased: false,
    };

    return carrito;
  }

  static getProductoForDBFileSystem(product) {
    const itemComplete = {id: uuidv4(), timeStamp: Date.now(), ...product};
    return itemComplete;
  }

  static encryptPassword(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10));
  }

  static isValidPassword(user, password) {
    return bCrypt.compareSync(password, user.password);
  }
}

module.exports = ApiUtils;
