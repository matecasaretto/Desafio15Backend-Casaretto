import productModel from "../models/product.model.js";

class DbProductManager {
  async consultarProductos() {
    try {
      const products = await productModel.find();
      return products;
    } catch (error) {
      console.error('Error al consultar productos desde MongoDB:', error.message);
      throw error;
    }
  }

  async addProduct(newProduct) {
    try {
      const products = await this.consultarProductos();

      if (products.length === 0) {
        // Si no hay productos, asignar el id como 1
        newProduct.id = 1;
      } else {
        // Obtener el último ID y asignar el siguiente
        const lastProductId = products[products.length - 1].id;
        newProduct.id = lastProductId + 1;
      }

      const createdProduct = await productModel.create(newProduct);

      console.log('Product added:', createdProduct);

      return createdProduct;
    } catch (error) {
      console.error('Error al agregar producto:', error.message);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await productModel.findOne({ id });
      console.log(`Product with ID ${id}:`, product);

      return product;
    } catch (error) {
      console.error('Error al obtener producto por ID:', error.message);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const result = await productModel.deleteOne({ id });

      if (result.deletedCount > 0) {
        console.log(`Producto con ID ${id} eliminado.`);
      } else {
        console.log(`No se encontró ningún producto con el ID ${id}. No se eliminó nada.`);
      }
    } catch (error) {
      console.error('Error al eliminar producto por ID:', error.message);
      throw error;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const result = await productModel.updateOne({ id }, { $set: updatedProduct });

      if (result.nModified > 0) {
        console.log(`Producto con ID ${id} actualizado.`);
      } else {
        console.log(`No se encontró ningún producto con el ID ${id}. No se realizó ninguna actualización.`);
      }
    } catch (error) {
      console.error('Error al actualizar producto por ID:', error.message);
      throw error;
    }
  }
}

export { DbProductManager };
