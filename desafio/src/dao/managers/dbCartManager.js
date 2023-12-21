import mongoose from 'mongoose';
import cartModel from '../models/cart.model.js';

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

      const existingProduct = cart.products.find((p) => p.id === productId);

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ id: productId, quantity });
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
}

export { DbCartManager };
