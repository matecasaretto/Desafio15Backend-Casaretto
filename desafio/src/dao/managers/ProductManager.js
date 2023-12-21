import fs from 'fs/promises';
import path from 'path';
import { __dirname } from "../../utils.js";

export default class ProductManager {
  constructor(io) {
    this.filePath = path.join(__dirname, 'files', 'Products.json');
    this.io = io;
  }

  async consultarProductos() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      const products = JSON.parse(data);
      return products;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      } else {
        console.error('Error al consultar productos:', error.message);
        throw error;
      }
    }
  }

  async addProduct(newProduct) {
    try {
      let products = await this.consultarProductos();
  
      if (!Array.isArray(products)) {
        products = [];
      }
  
      if (products.length === 0) {
        newProduct.id = 1;
      } else {
        newProduct.id = products[products.length - 1].id + 1;
      }
  
      newProduct.status = true; 
      products.push(newProduct);
  
      console.log('Product added:', newProduct);
  
      await fs.writeFile(this.filePath, JSON.stringify(products, null, '\t'));

      
      this.io.emit('addProduct', { product: newProduct });
  
      return products;
    } catch (error) {
      console.error('Error al agregar producto:', error.message);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const products = await this.consultarProductos();
      console.log('All products:', products);
  
      const product = products.find(product => product.id === id);
      console.log(`Product with ID ${id}:`, product);
  
      if (product) {
        return product;
      } else {
        console.log(`No se encontró ningún producto con el ID ${id}.`);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener producto por ID:', error.message);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      let products = await this.consultarProductos();
  
      const indexToRemove = products.findIndex(product => product.id === id);
  
      if (indexToRemove !== -1) {
        products.splice(indexToRemove, 1);
        await fs.writeFile(this.filePath, JSON.stringify(products, null, '\t'));
        console.log(`Producto con ID ${id} eliminado.`);

        
        this.io.emit('productChanged');
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
      let products = await this.consultarProductos();

      const indexToUpdate = products.findIndex(product => product.id === id);

      if (indexToUpdate !== -1) {
    
        updatedProduct.id = id;

        products[indexToUpdate] = updatedProduct;

        await fs.writeFile(this.filePath, JSON.stringify(products, null, '\t'));

        console.log(`Producto con ID ${id} actualizado.`);

        // Emitir evento 'productChanged'
        this.io.emit('productChanged');
      } else {
        console.log(`No se encontró ningún producto con el ID ${id}. No se realizó ninguna actualización.`);
      }
    } catch (error) {
      console.error('Error al actualizar producto por ID:', error.message);
      throw error;
    }
  }
}
