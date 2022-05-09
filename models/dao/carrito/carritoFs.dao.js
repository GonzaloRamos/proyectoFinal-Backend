const {DB, utils, models} = require("../../../constants/routes");
const {getCarritoForDBFileSystem} = require(utils.apiUtils);
const FileSystem = require(models.fs.main);

/**
 * Clase de carrito que funciona como DAO. Toma los métodos del fileSystem.
 */

class Carrito extends FileSystem {
  constructor() {
    super(DB, "json", "carrito");
  }

  /**
   * Crea un objeto para el carrito que va a ser almacenado en el fileSystem.
   * @returns Retorna todos los datos del carrito creado
   */
  async create() {
    try {
      const exists = this.fileExist();
      const carrito = getCarritoForDBFileSystem();
      if (!exists) {
        const result = await this.createFile([carrito]);
        return {created: result, ...carrito};
      }
      const result = await this.writeFile(carrito);
      return {created: result, ...carrito};
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * En base al id del carrito retorna todos los productos.
   * @param {string} id id del carrito a buscar.
   * @returns Retorna todos los productos del carrito.
   */
  async getAllProducts(id) {
    try {
      const carrito = await this.getCarrito(id);
      return carrito.products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Agrega un producto al carrito segun su id. La funcion agrega la propiedad quantity para llevar un conteo de cuando productos tiene agregado.
   * @param {string} id id del carrito.
   * @param {Object} product Recibe un objeto con los datos del producto a ser agregado
   * @returns Retorna el producto agregado y el id del carrito al que se agrego
   */
  async addProduct(id, product) {
    try {
      const allCarritos = await this.getAllCarritos();
      const carrito = await this.getCarrito(id);
      const newList = allCarritos.filter((e) => e.id !== id);
      const exists = carrito.products.some((e) => e.id === product.id);
      if (!exists) {
        const productForDB = {...product, quantity: 1};
        carrito.products.push(productForDB);
        carrito.isEmpty = false;
        newList.push(carrito);
        await this.writeFile(newList, false);
        return {productForDB, id};
      }
      const productFromList = carrito.products.find((e) => e.id === product.id);
      const newProductList = carrito.products.filter((e) => {
        e.id !== productFromList.id;
      });
      productFromList.quantity = productFromList.quantity + 1;
      newProductList.push(productFromList);
      carrito.products = newProductList;
      newList.push(carrito);
      await this.writeFile(newList, false);
      return {productFromList, id};
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Elimina el carrito entero.
   * @param {string} id id del carrito.
   * @returns Retorna el carrito eliminado
   */
  async delete(id) {
    try {
      const allCarritos = await this.getAllCarritos();
      const carrito = await this.getCarrito(id);
      const newList = allCarritos.filter((carrito) => carrito.id !== id);
      await this.writeFile(newList, false);
      return carrito;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Devuelve todos los carritos.
   * @returns Array de carritos
   */
  async getAllCarritos() {
    const allData = await this.readFile();
    return JSON.parse(allData);
  }

  /**
   * Devuelve un id en específico.
   * @param {string} id id del carrito.
   * @returns Retorna un carrito en específico.
   */
  async getCarrito(id) {
    try {
      const allCarritos = await this.readFile();
      const carrito = JSON.parse(allCarritos).find((carrito) => carrito.id === id);
      if (!carrito) {
        throw `No se encontro un carrito con id ${id}`;
      }
      return carrito;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Funcion que elimina un producto específico de un carrito en específico.
   * @param {string} id id del carrito.
   * @param {string} idProduct id del producto
   * @returns true | false
   */
  async deleteProduct(id, idProduct) {
    try {
      const carrito = await this.getCarrito(id);
      const productExist = carrito.some((producto) => producto.id === id);

      if (!productExist) {
        throw `No existe el producto con id ${idProduct} en el carrito ${id}`;
      }

      const newList = carrito.products.filter((product) => product.id !== idProduct);
      carrito.products = newList;
      await this.writeFile(newList);
      return true;
    } catch (error) {
      console.error(error.message);
    }
  }
}
module.exports = Carrito;
