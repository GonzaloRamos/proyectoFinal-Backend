const path = require("path");

class Utils {
  /**
   * Funcion simple que devuelve contenido en formato JSON.
   * @param {*} content contenido a ser convertido a JSON. Puede ser cualquier tipo de dato.
   * @returns {*}  Contenido en formato JSON.
   */
  static parseToJson(content) {
    try {
      return JSON.stringify(content, null, 2);
    } catch (error) {
      console.error(error.message);
    }
  }

  /**
   * Funcion simple que recibe un array de directorios y devuelve la ruta completa.
   * @param {Array} route Array de strings con cada ruta
   * @returns Ruta completa
   */
  static getPath(route) {
    const completeRoute = path.join(process.cwd(), ...route);
    return completeRoute;
  }

  /**
   * Mira si tiene keys el objeto. Si tiene, devuelve true.
   * @param {Object} obj
   * @returns boolean true|false
   */
  static objectHasValues(obj) {
    const keys = Object.keys(obj);
    if (keys.length === 0) {
      return false;
    }

    return true;
  }
}
module.exports = Utils;
