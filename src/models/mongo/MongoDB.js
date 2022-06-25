const Mongoose = require("mongoose");
const {log4js} = require("../../config/config.index");
const {mongoDB} = require("../../config/config.index");
(async () => {
  await Mongoose.connect(mongoDB.uri);
  log4js.consoleLogger.info("Connected to MongoDB");
})();

class MongoDB {
  constructor(collection, schema) {
    this.model = Mongoose.model(collection, schema);
    this.mongoose = Mongoose;
  }

  /**
   * Recibe información en formato objeto y la guarda en la base de datos
   * @param {Object} data - Información a guardar
   * @returns {Object} - Documento creado
   */
  async create(data) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Busca todos los documentos disponibles en la base de datos en la colección que se especifique en el constructor.
   * @returns {Array} - Array de documentos
   */
  async getAll() {
    try {
      const result = await this.model.find({}, {_id: 1, __v: 0});
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   *
   * @param {String} id - Id del documento
   * @throws {Error} - Si no se encontro el documento
   * @returns {Object} - Documento
   */
  async getById(id) {
    try {
      const result = await this.model.findById(id);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Se le pasa un objeto con fltros y devuelve todos los docuemntos que coincidan con esos filtros.
   *
   * @param {Object} filter - Objeto con el filtrado
   * @returns {Array} - Array de documentos
   */
  async getByFilter(filter) {
    try {
      const result = await this.model.findOne(filter);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Actualiza un documento en la base de datos.
   * Busca el documento por el id y lo actualiza con los datos que se le pasan.
   * @param {String} id - Id del document
   * @param {Object} data - Data para hacer update
   * @returns {Object} - Objeto con la información del proceso de actualizacion.
   */
  async updateOne(id, data) {
    try {
      const document = await this.model.updateOne({_id: id}, data, {new: true});

      return document;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Encuentra un documento por el id y lo elimina.
   * @param {String} id - Document id
   * @returns {Object} - Object information delete
   */
  async deleteById(id) {
    try {
      return await this.model.deleteOne({_id: id});
    } catch (error) {
      throw new Error(error.message);
    }
  }
  /**
   * Se pasa un objeto con filtros y lo elimina.
   * @param {Object} filter - Filter Object
   * @returns {Object} - Object information delete
   */
  async deleteByFilter(filter) {
    try {
      return await this.model.deleteOne(filter);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = MongoDB;
