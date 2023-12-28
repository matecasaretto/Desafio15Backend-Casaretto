import mongoose from 'mongoose';
import cartModel from '../models/cart.model.js';
import productModel from '../models/product.model.js';

class DbCartManager {
  async getCarts() {
    try {
      const carts = await cartModel.find();
      return carts;
    } catch (error) {
      console.error('Error al obtener carritos desde MongoDB:', error.message);
      throw error;
    }
  }

  async createCart() {
    try {
      const lastCart = await cartModel.findOne().sort({ id: -1 });

      const newCartId = lastCart ? lastCart.id + 1 : 1;

      const newCart = new cartModel({
        id: newCartId,
        products: [],
      });

      await newCart.save();

      return newCart;
    } catch (error) {
      console.error('Error al crear un nuevo carrito en MongoDB:', error.message);
      throw error;
    }
  }

  async getProductsInCart(cartId) {
    try {
      const cart = await cartModel.findOne({ id: cartId });

      if (!cart) {
        throw new Error(`Carrito con ID ${cartId} no encontrado.`);
      }

      return cart.products;
    } catch (error) {
      console.error('Error al obtener productos del carrito en MongoDB:', error.message);
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await cartModel.findOne({ id: cartId });
  
      if (!cart) {
        throw new Error(`Carrito con ID ${cartId} no encontrado.`);
      }
  
      const existingProduct = cart.products.find((p) => p.product.toString() === productId.toString());
  
      if (existingProduct) {
       
        existingProduct.quantity += quantity;
      } else {
       
        const product = await productModel.findOne({ _id: productId });
  
        if (!product) {
          throw new Error(`Producto con ID ${productId} no encontrado.`);
        }
  
      
        cart.products.push({ product: product._id, quantity });
      }
  
     
      await cart.save();
  
      return cart;
    } catch (error) {
      console.error('Error al agregar un producto al carrito en MongoDB:', error.message);
      throw error;
    }
  }
  

  async deleteCart(cartId) {
    try {
      const result = await cartModel.deleteOne({ id: cartId });

      if (result.deletedCount > 0) {
        console.log(`Carrito con ID ${cartId} eliminado exitosamente`);
        return true;
      } else {
        throw new Error(`Carrito con ID ${cartId} no encontrado.`);
      }
    } catch (error) {
      console.error(`Error al eliminar el carrito con ID ${cartId}: ${error.message}`);
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await cartModel.findOne({ id: cartId });

      if (!cart) {
        throw new Error(`Carrito con ID ${cartId} no encontrado.`);
      }

      return cart;
    } catch (error) {
      console.error(`Error al obtener el carrito con ID ${cartId}: ${error.message}`);
      throw error;
    }
  }

  async deleteAllProductsFromCart(cartId) {
    try {
      const cart = await cartModel.findOne({ id: cartId });

      if (!cart) {
        throw new Error(`Carrito con ID ${cartId} no encontrado.`);
      }

 
      cart.products = [];

      await cart.save();

      console.log(`Todos los productos del carrito con ID ${cartId} han sido eliminados`);
      return cart;
    } catch (error) {
      console.error(`Error al eliminar todos los productos del carrito con ID ${cartId}: ${error.message}`);
      throw error;
    }
  }

  async updateCart(cartId, updatedProducts) {
    try {
      const cart = await cartModel.findOne({ id: cartId });
  
      if (!cart) {
        throw new Error(`Carrito con ID ${cartId} no encontrado.`);
      }
  
     
      cart.products = updatedProducts;
  
      await cart.save();
  
      return cart;
    } catch (error) {
      console.error(`Error al actualizar el carrito con ID ${cartId}: ${error.message}`);
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await cartModel.findOne({ id: cartId });
  
      if (!cart) {
        throw new Error(`Carrito con ID ${cartId} no encontrado.`);
      }
  
      const product = cart.products.find((p) => p.id.toString() === productId.toString());
  
      if (!product) {
        throw new Error(`Producto con ID ${productId} no encontrado en el carrito.`);
      }
  
      
      if (typeof newQuantity !== 'number' || newQuantity < 0) {
        throw new Error('La cantidad debe ser un número positivo.');
      }
      console.log('Antes de la actualización:', cart);
      console.log('Producto a actualizar:', product);
  
     
      product.quantity = newQuantity;
  
      await cart.save();
      console.log('Después de la actualización:', cart);
  
      return cart;
    } catch (error) {
      console.error(`Error al actualizar la cantidad del producto en el carrito: ${error.message}`);
      throw error;
    }
  }

}

export { DbCartManager };
