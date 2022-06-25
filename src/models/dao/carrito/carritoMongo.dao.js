const {log4js} = require("../../../config/config.index");

//Transpoter de nodemailer
const NodeMailerClient = require("../../mailer/NodeMailerClient");
//Cliente de twilio
const TwilioClient = require("../../twilio/TwilioClient");
//Clase principal de mongoDB con los métodos de accesso a la base de datos
const MongoDB = require("../../mongo/MongoDB");
//Dao de productos
const Products = require("../productos/productosMongo.dao");
//Dao de usuarios
const User = require("../user/userMongo.dao");

const CarritoSchema = require("../../mongo/schemas/Carrito.schema");

class Carrito extends MongoDB {
  /**
   * Constructor que tiene pre definido los parámetros de conexión a la base de datos.
   */
  constructor() {
    super("carritos", CarritoSchema);
  }

  /**
   * Funcion para crear el carrito de compras con un usuario asociado.
   * La mayoria de los datos del carritos son pre establecidos en su Schema.
   * Solo se le pasa el usuario como parámetro para asociarlo con su object id.
   * @param {Object} user - User object
   * @returns {Object} - Carrito object
   */
  async createCarrito(userId) {
    try {
      const carrito = await this.create({user: userId});
      return carrito;
    } catch (error) {
      log4js.errorLogger.error(error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Encuentra el carrito por id y devuelve su propiedad de products.
   * @param {String} id - Carrito id
   * @throws {Error} - Si no se encontro el carrito
   * @returns {Array} - Array of products
   */
  async getAllProducts(id) {
    try {
      const carrito = await this.getById(id);
      if (!carrito) {
        throw new Error("No se encontro el carrito");
      }
      const {products} = await this.populateCarrito(carrito, {path: "products"});
      return products;
    } catch (error) {
      log4js.errorLogger.error(error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Agrega un producto al carrito.
   * @param {String} id - Carrito id
   * @param {String} idProducto - Producto id
   * @throws {Error} - Si no se encontro el carrito o el producto
   * @returns {Array} - Primera posicion, el carrito actualizado. Segunda posicion, el producto agregado.
   */
  async addProduct(id, idProducto) {
    try {
      const productDao = new Products();
      const product = await productDao.getProductById({_id: idProducto});
      if (!product) {
        throw new Error("No se encontro el producto");
      }
      const result = await this.updateOne(id, {
        $push: {products: idProducto},
        isEmpty: false,
      });

      if (!result.acknowledged || result.modifiedCount === 0) {
        throw new Error("No se encontro un carrito");
      }

      return [result, product];
    } catch (error) {
      log4js.errorLogger.error(error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Borra la totalidad del carrito. Encuentra el carrito y lo borra.
   * @param {String} id - Carrito id
   * @throws {Error} - Si no se encontro el carrito
   * @returns {Object} - Object information delete.
   */
  async deleteCarrito(id) {
    try {
      const result = await this.deleteById(id);
      if (!result.acknowledged || result.deletedCount === 0) {
        throw new Error("No se encontro un registro");
      }
      return result;
    } catch (error) {
      log4js.errorLogger.error(error.message);
      throw new Error(error.message);
    }
  }
  /**
   * Borra un producto del carrito.
   * @param {String} id - Carrito id
   * @param {String} idProducto - Producto id
   * @throws {Error} - Si no se encontro el carrito o el producto
   * @returns {Object} - Update object information
   */
  async deleteProduct(id, idProducto) {
    try {
      const carrito = await this.getById(id);
      if (!carrito) {
        throw new Error("No se encontro el carrito");
      }
      const result = await this.updateOne(id, {
        $pull: {products: idProducto},
      });
      if (!result.acknowledged || result.modifiedCount === 0) {
        throw new Error("No se encontro un producto dentro del carrito");
      }
      return result;
    } catch (error) {
      log4js.errorLogger.error(error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Devuelve un carrito de compras.
   * Los sub-documentos anidados no son populados.
   * @param {String} id - Carrito id
   * @throws {Error} - Si no se encontro el carrito
   * @returns {Object} - Carrito object
   */
  async getCarrito(carritoId) {
    try {
      const carrito = await this.getById(carritoId);
      if (!carrito) {
        throw new Error("No se encontro un carrito");
      }

      return carrito;
    } catch (error) {
      log4js.errorLogger.error(error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Función que devuelve un carrito segun el id de un usuario.
   * Los sub-documentos anidados no son populados.
   * @param {String} id - User id
   * @throws {Error} - Si no se encontro el usuario o el carrito
   * @returns {Object} - Carrito object
   */
  async getCarritoByUser(userId) {
    try {
      //Instancio el dao para saber si el ususario pasado por parámetro existe
      const userDao = new User();
      const user = await userDao.getUserById(userId);
      if (!user) {
        throw new Error("No se encontro un usuario");
      }
      //Ahora si busco el carrito asociado
      const carrito = await this.getByFilter({user: user._id});
      if (!carrito) {
        throw new Error("No se encontro un carrito");
      }
      return carrito;
    } catch (error) {
      log4js.errorLogger.error(error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Compra el carrito de compras.
   * Falta mejorar el proceso de compra. Habria que guardar el carrito en una coleccion de compras y borrarla de la coleccion del carrito.
   * @param {String} id - id del carrito
   * @throws {Error} - Si no se encontro el carrito
   * @throws {Error} - Si no se encontro el usuario
   * @throws {Error} - Si no se encontro el producto
   * @returns {Array} - [0] - Objeto del carrito [1] - Productos comprados [2] - Usuario que realizo la compra
   */
  async purchaseCarrito(id) {
    try {
      //Obtengo el carrito
      const carrito = await this.getById(id);
      if (!carrito) {
        throw new Error("No se encontro un carrito");
      }

      //Cambio su estado a comprado y borro productos
      const carritoResult = await this.updateOne(carrito._id, {
        purchased: true,
        products: [],
      });

      //Borro el carrito de compras
      if (!carritoResult.acknowledged || carritoResult.modifiedCount === 0) {
        throw new Error("No se pudo verificar la compra");
      }

      //Obtengo el usuario uso el método de populación de mongoose
      const {user} = await this.populateCarrito(carrito, {path: "user"});
      const {products} = await this.populateCarrito(carrito, {path: "products"});

      //Envio el correo
      const nodeMailerClient = new NodeMailerClient();
      nodeMailerClient.setSubject(`Nuevo pedido de ${user.name}`);
      nodeMailerClient.setHtml(
        `<p style="color: black;"> Su compra esta en proceso de verificacion. Usuario: ${
          user.name
        }, Email: ${user.email}. Los productos a comprar son: ${products
          .map((product) => {
            return product.name;
          })
          .join(", ")}</p>`
      );
      await nodeMailerClient.sendMail();

      //Instancio el cliente de twilio
      const twilioClient = new TwilioClient();
      //Armo el body del whatsapp
      twilioClient.setBody(
        `Su compra esta en proceso de verificacion. Usuario: ${user.name}, Email: ${
          user.email
        }. Los productos a comprar son: ${carrito.products
          .map((product) => {
            return product.name;
          })
          .join(", ")}`
      );
      //Paso el numero de telefono del cliente.
      twilioClient.setTo(user.phone);
      await twilioClient.sendMessage();

      //Devuelvo el resultado de actualizar el carrito anterior
      return [carritoResult, products, user];
    } catch (error) {
      log4js.errorLogger.error(error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Funcion que popula un carrito. Signfica que en base a un ObjectId anidado en una propiedad
   * se obtiene y escribe en la propiedad del carrito el documento al que esta asociado ese ID.
   * @param {Object} carritoObj - Carrito object
   * @param {Object} params - Params acepta un objecto con una propiedad path que hace referencia a un schema de mongoose.
   * @returns {Object} - Populated carrito
   */
  async populateCarrito(carritoObj, params) {
    try {
      const carrito = await this.model.populate(carritoObj, params);
      return carrito;
    } catch (error) {
      log4js.errorLogger.error(error.message);
      throw new Error(error.message);
    }
  }
}
module.exports = Carrito;
