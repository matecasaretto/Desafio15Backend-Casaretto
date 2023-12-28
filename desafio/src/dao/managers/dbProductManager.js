import mongoosePaginate from 'mongoose-paginate-v2';
import productModel from "../models/product.model.js";

productModel.schema.plugin(mongoosePaginate);

class DbProductManager {
  async consultarProductos(options, query, category, sortOrder) {
    try {
      let filtro = {};

      // Añade la búsqueda en $text solo si query tiene un valor
      if (query) {
        filtro.$or = [
          { title: { $regex: new RegExp(query, 'i') } },
          { description: { $regex: new RegExp(query, 'i') } },
          { $text: { $search: query } },
        ];
      }

      if (category) {
        filtro.category = category;
      }

      // Ajusta la opción de ordenamiento según sortOrder
      const sortOption = sortOrder === 'desc' ? { price: -1 } : { price: 1 };

      // Agrega la opción de ordenamiento a la consulta
      const paginacion = await productModel.paginate(filtro, { ...options, sort: sortOption });

      return paginacion;
    } catch (error) {
      console.error('Error al obtener productos desde MongoDB:', error.message);
      throw error;
    }
  }
  

  async addProduct(newProduct) {
    try {
      const products = await this.consultarProductos();
      if (newProduct && (typeof newProduct.id === 'undefined' || newProduct.id === null)) {
        if (products.length === 0) {
          newProduct.id = 1;
        } else {
          const lastProductId = products[products.length - 1].id;
          newProduct.id = lastProductId + 1;
        }
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
