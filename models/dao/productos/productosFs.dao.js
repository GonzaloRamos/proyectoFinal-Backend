const {models, DB, utils} = require("../../../constants/routes");
const {getProductoForDBFileSystem} = require(utils.apiUtils);
const FileSystem = require(models.fs.main);

class ApiProductos extends FileSystem {
  constructor() {
    super(DB, "json", "productos");
  }

  async getAll() {
    try {
      const allProducts = await this.readFile();
      return JSON.parse(allProducts);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getById(id) {
    try {
      const allProducts = await this.readFile();
      const producto = JSON.parse(allProducts).find((product) => product.id === id);
      if (!producto) {
        throw new Error(`No se encontro el producto con id ${id}`);
      }
      return producto;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async create(product) {
    try {
      const exists = this.fileExist();
      const completeProduct = getProductoForDBFileSystem(product);

      if (!exists) {
        const result = await this.createFile([completeProduct]);
        return result;
      }
      const result = await this.writeFile(completeProduct);
      return {created: result, ...completeProduct};
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const allProducts = await this.readFile(true);
      let product = allProducts.find((producto) => producto.id === id);
      if (!product) {
        throw new Error(`No se encontro el producto con id ${id}`);
      }
      const newList = allProducts.filter((producto) => producto.id !== id);
      product = {...product, ...updatedProduct};
      newList.push(product);
      const result = await this.writeFile(newList, false);
      return {updated: result, ...updatedProduct};
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProducto(id) {
    try {
      const allProducts = await this.readFile(true);
      const exists = allProducts.some((product) => product.id === id);
      if (!exists) {
        throw new Error(`No existe el producto con id ${id}`);
      }
      const newList = allProducts.filter((producto) => producto.id !== id);
      const result = await this.writeFile(newList, false);

      return {deleted: result, id};
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = ApiProductos;
