const {log4js} = require("../../../config/config");
const {models} = require("../../../constants/routes");
//Transpoter de nodemailer
const transporter = require("../../../mailer/nodemailer");
//Cliente de twilio
const client = require("../../../twilio/twilio");
//Clase principal de mongoDB con los métodos de accesso a la base de datos
const MongoDB = require("../../mongo/MongoDB");
//Dao de productos
const Products = require("../productos/productosMongo.dao");
//Dao de usuarios
const User = require("../user/userMongo.dao");

const CarritoSchema = require(models.mongo.schemas.carrito);

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
      return carrito.products;
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
   * @returns {Object} - Object information update
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

      return result;
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
      const userDao = new User();
      const user = await userDao.getUserById(userId);
      if (!user) {
        throw new Error("No se encontro un usuario");
      }
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
   * @returns
   */
  async purchaseCarrito(id) {
    try {
      //Obtengo el carrito
      const carrito = await this.getById(id);
      if (!carrito) {
        throw new Error("No se encontro un carrito");
      }

      //Cambio su estado a comprado y borro productos
      const result = await this.updateOne(carrito._id, {purchased: true, products: []});

      //Borro el carrito de compras
      if (!result.acknowledged || result.modifiedCount === 0) {
        throw new Error("No se pudo verificar la compra");
      }

      //Obtengo el usuario uso el método de populación de mongoose
      const {user} = await this.populateCarrito(carrito, {path: "user"});
      const {products} = await this.populateCarrito(carrito, {path: "products"});

      //Envio el correo
      const mailOptions = {
        from: "Proyecto final coderhouse Gonzalo Ramos",
        to: process.env.MAIL_ADMIN,
        subject: `Nuevo pedido de ${user.name}`,
        html: `<p style="color: black;"> Su compra esta en proceso de verificacion. Usuario: ${
          user.name
        }, Email: ${user.email}. Los productos a comprar son: ${products
          .map((product) => {
            return product.name;
          })
          .join(", ")}</p>`,
      };
      await transporter.sendMail(mailOptions);

      //Envio el whatsapp
      const twilioOpt = {
        body: `Su compra esta en proceso de verificacion. Usuario: ${user.name}, Email: ${
          user.email
        }. Los productos a comprar son: ${carrito.products
          .map((product) => {
            return product.name;
          })
          .join(", ")}`,
        mediaUrl: [
          "https://www.investingmoney.biz/public/img/art/xl/18012019161021Twilio-IoT.jpg",
        ],
        from: "whatsapp:+14155238886", //puede requerir iniciar el sandbox desde twilio
        to: `whatsapp:+549${user.phone}`,
      };
      await client.messages.create(twilioOpt);

      //Devuelvo el resultado de actualizar el carrito anterior
      return result;
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
