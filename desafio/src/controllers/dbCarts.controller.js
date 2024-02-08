import { DbCartManager } from "../dao/managers/dbCartManager.js";
import cartModel from "../dao/models/cart.model.js";
import productModel from "../dao/models/product.model.js";
import mongoose from 'mongoose';


const cartManager = new DbCartManager();

async function getAllCarts(req, res) {
  try {
    const carts = await cartModel.find().populate('products.product');
    res.json({ carts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getCartById(req, res) {
    const { cartId } = req.params;
  
    try {
      
      const cart = await cartModel.findById(cartId).populate('products.product');
  
      
      if (cart) {
        res.json(cart); 
      } else {
        res.status(404).json({ error: `Carrito con ID ${cartId} no encontrado` });
      }
    } catch (error) {
      console.error('Error en la ruta /api/carts/:cartId:', error);
      res.status(500).json({ error: error.message });
    }
  }
  

async function createCart(req, res) {
  try {
    const newCart = await cartManager.createCart();
    res.json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function addProductToCart(req, res) {
  const { cartId } = req.params;
  const { productId, quantity } = req.body;

  try {
    const product = await productModel.findOne({ id: productId });

    if (!product) {
      return res.status(404).json({ error: `Producto con ID ${productId} no encontrado` });
    }

    const updatedCart = await cartManager.addProductToCart(cartId, product._id, quantity);

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteCart(req, res) {
    const { cartId } = req.params;
  
    try {
      const deletedCart = await cartModel.findByIdAndDelete(cartId);
  
      if (deletedCart) {
        res.json({ message: `Carrito con ID ${cartId} eliminado correctamente` });
      } else {
        res.status(404).json({ error: `No se encontró ningún carrito con el ID ${cartId}` });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

async function deleteProductFromCart(req, res) {
  const { cartId, productId } = req.params;

  try {
    const cart = await cartManager.deleteProductFromCart(cartId, productId);

    res.json({ message: `Producto con ID ${productId} eliminado del carrito con ID ${cartId} exitosamente`, cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateCart(req, res) {
  const { cartId } = req.params;
  const updatedProducts = req.body;

  try {
    const updatedCart = await cartManager.updateCart(cartId, updatedProducts);
    res.json(updatedCart);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      res.status(400).json({ error: 'Validation failed', details: validationErrors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

async function updateProductQuantity(req, res) {
  const { cartId, productId } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCart = await cartManager.updateProductQuantity(cartId, productId, quantity);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteAllProductsFromCart(req, res) {
  const { cartId } = req.params;

  try {
    const cart = await cartModel.findOne({ id: cartId });

    if (cart) {
      cart.products = [];
      await cart.save();
      res.json({ message: `Todos los productos del carrito con ID ${cartId} han sido eliminados` });
    } else {
      res.status(404).json({ error: `Carrito con ID ${cartId} no encontrado` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export {
  getAllCarts,
  getCartById,
  createCart,
  addProductToCart,
  deleteCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  deleteAllProductsFromCart
};
