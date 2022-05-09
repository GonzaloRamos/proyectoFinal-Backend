const path = require("path");
const fs = require("fs/promises");
const {utils} = require("../../constants/routes");
const {existsSync} = require("fs");
const {parseToJson} = require(utils.main);

/**
 * Clase modelo para la escritura en el fileSystem.
 * No hace mas que dar las operaciones básicas de escritura y
 * lectura
 */

class FileSystem {
  /**
   *
   * @param {string} route ruta al archivo.
   * @param {string} type Extensión del archivo. Debe tener un punto al principio. Ejemplo: json
   * @param {string} fileName nombre del archivo
   */

  constructor(route, type, fileName) {
    this.route = route;
    this.type = type;
    this.fileName = fileName;
  }

  /**
   *Escribe un archivo, lo sobreescribe con el contenido dado. Se recomiendo obtener la información previamente con readFile.
   * @param {*} content contenido a ser escrito
   * @param {Boolean} preserve mantiene el contendio previo del archivo.
   * @param {string} route ruta al archivo. Por default toma el valor del constructor. Se le puede pasar uno personalizado.
   * @param {string} type extension del archivo. Por default toma la del constructor.
   * @param {string} fileName nombre del archivo. Por default toma el del constructor.
   */
  async writeFile(
    content,
    preserve = true,
    route = this.route,
    type = this.type,
    fileName = this.fileName
  ) {
    try {
      const fullRoute = path.join(route, `${fileName}.${type}`);
      if (type === "json") {
        const dataFile = await this.readFile();
        if (!preserve) {
          const parsedContent = parseToJson(content);
          await fs.writeFile(fullRoute, parsedContent, "utf-8");
          return true;
        }
        const parsedFileData = JSON.parse(dataFile);

        if (Array.isArray(parsedFileData)) {
          parsedFileData.push(content);

          await fs.writeFile(fullRoute, parseToJson(parsedFileData), "utf-8");
          return true;
        }
      }
      throw new Error(`Unica extension soportada es .json . Demas en desarrollo.`);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   *
   * @param {string} route ruta al archivo. Por default toma el valor del constructor. Se le puede pasar uno personalizado.
   * @param {string} fileName nombre del archivo. Por default toma el del constructor.
   * @param {string} type extension del archivo. Por default toma la del constructor.
   * @returns
   */
  async deleteFile(route = this.route, fileName = this.fileName, type = this.type) {
    try {
      const fullRoute = path.join(route, `${fileName}.${type}`);
      const result = await fs.unlink(fullRoute);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Función parecida a writeFile. Controla mejor si el archivo existe y que hacer para evitar errores de sobreescritura. Si el archivo existe no crea ninguno y permite crear un archivo con contenido dentro.
   * @param {*} content contenido a incluir en el archivo.
   * @param {string} route ruta al archivo. Por default toma el valor del constructor. Se le puede pasar uno personalizado.
   * @param {string} fileName nombre del archivo. Por default toma el del constructor.
   * @param {string} type extension del archivo. Por default toma el del constructor
   * @returns true|false.
   */
  async createFile(
    content = "",
    route = this.route,
    fileName = this.fileName,
    type = this.type
  ) {
    try {
      const fullRoute = path.join(route, `${fileName}.${type}`);
      const exists = this.fileExist(fullRoute);
      if (!exists) {
        throw `Ya existe el archivo ${fileName} con extension ${type} en la ruta ${route}`;
      }
      if (type === "json") {
        const parsedContent = parseToJson(content);
        const result = await this.writeFile(route, fileName, type, parsedContent);
        return result;
      }
      throw `Solo archivos json son soportados`;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Función que retorna booleano si existe o no un archivo.
   * @param {string} route ruta al archivo. Por default toma el valor del constructor. Se le puede pasar uno personalizado.
   * @param {string} fileName nombre del archivo. Por default toma el del constructor.
   * @param {string} type extension del archivo. Por default toma el del constructor.
   * @returns true|false.
   */

  fileExist(route = this.route, fileName = this.fileName, type = this.type) {
    const fullRoute = path.join(route, `${fileName}.${type}`);
    const exist = existsSync(fullRoute);
    return exist;
  }

  /**
   * Función que lee la información de un archivo.
   * @param {Boolean} parse Define si es necesario parsear la información. Segun la extension del archivo va a parsear o no la información.
   * @param {string} route ruta al archivo. Por default toma el valor del constructor
   * @param {string} fileName nombre del archivo. Por default toma el valor del constructor.
   * @param {string} type extensión del archivo. Por default toma el valor del constructor
   * @returns data content formato JSON.
   */

  async readFile(
    parse = false,
    route = this.route,
    fileName = this.fileName,
    type = this.type
  ) {
    try {
      if (type === "json") {
        const fullRoute = path.join(route, `${fileName}.${type}`);
        const content = await fs.readFile(fullRoute, "utf-8");
        if (!parse) {
          return content;
        }
        const parsedContent = JSON.parse(content);
        return parsedContent;
      }
      throw `Solo archivos json son soportados`;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = FileSystem;
