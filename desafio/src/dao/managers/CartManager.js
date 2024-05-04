import fs from "fs/promises";
import path from "path";
import { __dirname } from "../../utils.js";

class CartManager {
  static cartCounter = 1; 

  constructor(pathFile) {
    this.path = path.join(__dirname, `/files/${pathFile}`);
  }

  async getCarts() {
    try {
      await fs.stat(this.path);
      const data = await fs.readFile(this.path, "utf-8");
      const carts = JSON.parse(data);
      return carts;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      } else {
        console.error("Error al leer el archivo de carritos:", error.message);
        throw error;
      }
    }
  }

  async createCart() {
    try {
      const carts = await this.getCarts();
  
     
      const lastCart = carts[carts.length - 1];
      const lastCartId = lastCart ? lastCart.id : 0;
  
     
      const newCartId = lastCartId + 1;
  
     
      const newCart = {
        id: newCartId,
        products: []
      };
  
    
      carts.push(newCart);
  
     
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
  
      return newCart;
    } catch (error) {
      console.error('Error al crear un nuevo carrito:', error.message);
      throw error;
    }
  }

  async getProductsInCart(cartId) {
    try {
      const carts = await this.getCarts();

    
      const cart = carts.find(c => c.id === parseInt(cartId));

      if (!cart) {
        throw new Error(`Carrito con ID ${cartId} no encontrado.`);
      }

      return cart.products;
    } catch (error) {
      console.error('Error al obtener productos del carrito:', error.message);
      throw error;
    }
  }
  async addProductToCart(cartId, productId, quantity) {
    try {
      const carts = await this.getCarts();
  
   
      const cart = carts.find(c => c.id === parseInt(cartId));
  
      if (!cart) {
        throw new Error(`Carrito con ID ${cartId} no encontrado.`);
      }
  
     
      const existingProduct = cart.products.find(p => p.id === parseInt(productId));
  
      if (existingProduct) {
        
        existingProduct.quantity += parseInt(quantity);
      } else {
       
        const productToAdd = {
          id: parseInt(productId),
          quantity: parseInt(quantity)
        };
  
       
        cart.products.push(productToAdd);
      }
  
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
  
      return cart;
    } catch (error) {
      console.error('Error al agregar un producto al carrito:', error.message);
      throw error;
    }
  }

}

export { CartManager };
