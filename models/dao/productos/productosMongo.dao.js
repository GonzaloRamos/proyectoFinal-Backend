const {models} = require("../../../constants/routes");
const MongoDB = require("../../mongo/MongoDB");
const ProductsSchema = require(models.mongo.schemas.productos);

class Products extends MongoDB {
  constructor() {
    super("products", ProductsSchema);
  }

  async add(data) {
    try {
      const result = await this.create(data);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getAllProducts() {
    try {
      const all = await this.getAll();
      return all;
    } catch (error) {
      console.error(error.message);
    }
  }

  async getProductById(id) {
    try {
      const product = await this.getById(id);
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProduct(id, data) {
    try {
      const result = await this.updateOne(id, data);
      if (!result.acknowledged) {
        throw new Error("Error al actualizar");
      }
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProduct(id) {
    try {
      const result = await this.deleteById(id);
      if (!result.acknowledged || result.deletedCount === 0) {
        throw new Error("No se encontro registro a eliminar");
      }
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = Products;
