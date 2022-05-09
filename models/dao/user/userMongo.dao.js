const {log4js} = require("../../../config/config");
const transporter = require("../../../mailer/nodemailer");
const Utils = require("../../../utils/Utils");
const ApiUtils = require("../../../utils/Utils.api");
const MongoDB = require("../../mongo/MongoDB");
const UserSchema = require("../../mongo/schemas/User.schema");

class User extends MongoDB {
  constructor() {
    super("user", UserSchema);
  }

  /**
   * Crea un usuario en la base de datos. Require el body de la petición. El file de la petición es opcional.
   * @param {Object} user - User object from express request body
   * @param {File} file - File object from express request file
   * @returns {Object} - User object with file
   */
  async createUser(user, file) {
    try {
      //Reviso si el objeto entregado tiene algun valor.
      if (!Utils.objectHasValues(user)) {
        throw new Error("No se encontro información en la petición");
      }

      //Formateo el path del archivo para guardarlo en la base de datos o lo dejo como undefined
      const photoPath = file ? file.path.replace("public/", "") : undefined;

      //Encripto la contraseña
      const encryptPass = ApiUtils.encryptPassword(user.password);
      //Completo el objeto de usuario
      const userComplete = {...user, photo: photoPath, password: encryptPass};
      //Creo el usuario
      const result = await this.create(userComplete);
      //Devuelvo el usuario
      return result;
    } catch (error) {
      log4js.errorLogger.error(error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Envia un email al administrador. Require la información del usuario y el email del administrador.
   * El email del administrador se obtiene de una variable de entorno MAIL_ADMIN
   * @param {Object} user - User object
   * @returns {Object} - Email object information
   */
  async sendMail(user) {
    try {
      const mailOptions = {
        from: "Node Js Server",
        to: process.env.MAIL_ADMIN,
        subject: "Nuevo registro",
        html: `<p style="color: black;"> id: ${user.id}
        Nombre y apellido: ${user.name} ${user.lastname} 
        edad:${user.age} 
        email: ${user.email} 
        address: ${user.address} 
        tel: ${user.phone}</p>`,
      };
      const mail = transporter.sendMail(mailOptions);
      return mail;
    } catch (error) {
      log4js.errorLogger.error(error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Obtiene todos los ususarios de la base de datos.
   * @returns {Array} - Array of users
   */
  async getAllUsers() {
    try {
      const result = await this.getAll();
      return result;
    } catch (error) {
      log4js.errorLogger.error(error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Obtiene un usuario segun los filtros que se le pase.
   * @param {Object} filter - Filter object
   * @returns {Object} - User object
   */
  async getUserByFilter(filter) {
    try {
      const result = await this.getByFilter(filter);
      return result;
    } catch (error) {
      log4js.errorLogger.error(error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Obtiene el usuario segun el id que se le pase.
   * @param {String} id - User id
   * @returns {Object} - User object
   */
  async getUserById(id) {
    try {
      const result = await this.getById(id);
      return result;
    } catch (error) {
      log4js.errorLogger.error(error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Busca al usuario segun id y reisa si es administrador o no.
   * @param {String} id - User id
   * @throws {Error} - Si no se encontro el ususario
   * @returns {Boolean} - True if user is admin, false if not.
   */
  async userIsAdmin(id) {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        throw new Error("No se encontro un registro");
      }
      return user.admin ? true : false;
    } catch (error) {
      log4js.errorLogger.error(error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Elimina un ususario según los filtros que se le pase.
   * @param {Object} filter - Filter object
   * @throws {Error} - Si no se encontro el ususario
   * @returns {Object} - Information object
   */
  async deleteUser(filter) {
    try {
      const result = await this.deleteByFilter(filter);
      if (!result.acknowledged || result.deletedCount === 0) {
        throw new Error("No se encontro un registro");
      }
      return result;
    } catch (error) {
      log4js.errorLogger.error(error.message);
      throw new Error(error.message);
    }
  }
}

module.exports = User;
