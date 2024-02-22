import mongoosePaginate from 'mongoose-paginate-v2';
import productModel from '../dao/models/product.model.js';

productModel.schema.plugin(mongoosePaginate);

class DbProductRepository {
    async getAllProducts(options, query, category, sortOrder) {
        try {
            let filtro = {};

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

            const sortOption = sortOrder === 'desc' ? { price: -1 } : { price: 1 };

            const paginacion = await productModel.paginate(filtro, { ...options, sort: sortOption });

            return paginacion;
        } catch (error) {
            console.error('Error al obtener productos desde MongoDB:', error);
            throw error;
        }
    }

    async updateProductStock(productId, newStock) {
        try {
          const updatedProduct = await productModel.findByIdAndUpdate(productId, { stock: newStock }, { new: true });
          if (!updatedProduct) {
            console.error(`Producto con ID ${productId} no encontrado.`);
            return null;
          }
          console.log(`Stock del producto con ID ${productId} actualizado a ${newStock}.`);
          return updatedProduct;
        } catch (error) {
          console.error('Error al actualizar el stock del producto:', error.message);
          throw error;
        }
      }

    async addProduct(newProduct) {
        try {
            const createdProduct = await productModel.create(newProduct);
            console.log('Product added:', createdProduct);
            return createdProduct;
        } catch (error) {
            console.error('Error al agregar producto:', error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await productModel.findById(id);
            if (!product) {
                console.error(`Producto con ID ${id} no encontrado.`);
                return null;
            }
            console.log(`Product with ID ${id}:`, product);
            return product;
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const result = await productModel.deleteOne({ _id: id });
            if (result.deletedCount > 0) {
                console.log(`Producto con ID ${id} eliminado.`);
            } else {
                console.log(`No se encontró ningún producto con el ID ${id}. No se eliminó nada.`);
            }
        } catch (error) {
            console.error('Error al eliminar producto por ID:', error);
            throw error;
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const result = await productModel.updateOne({ _id: id }, { $set: updatedProduct });
            if (result.nModified > 0) {
                console.log(`Producto con ID ${id} actualizado.`);
            } else {
                console.log(`No se encontró ningún producto con el ID ${id}. No se realizó ninguna actualización.`);
            }
        } catch (error) {
            console.error('Error al actualizar producto por ID:', error);
            throw error;
        }
    }
}

export { DbProductRepository };
