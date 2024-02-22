import { dbCartService } from '../repository/index.js';
import { dbProductService } from '../repository/index.js';
import { dbTicketService } from '../repository/index.js';
import { v4 as uuidv4 } from 'uuid';
import User from '../dao/models/user.model.js';

import mongoose from 'mongoose';

import Ticket from '../dao/models/ticket.model.js';
import productModel from '../dao/models/product.model.js';
import cartModel from '../dao/models/cart.model.js';



function generateUniqueCode() {
  return uuidv4();
}

function calculateTotalAmount(products) {
  let totalAmount = 0;
  for (const item of products) {
    totalAmount += item.product.price * item.quantity;
  }
  return totalAmount;
}


export async function purchaseCart(cartId, userId) {
  try {
    console.log("Iniciando proceso de compra...");
    console.log("El ID del carrito es:", cartId);

    const cart = await dbCartService.getCartById(cartId);
    console.log("Carrito encontrado:", cart);

    if (!cart) {
      console.log("El carrito no existe");
      return { error: "El carrito no existe" };
    }

    // Verificar el stock de cada producto en el carrito
    for (const cartProduct of cart.products) {
      const product = cartProduct.product;
      const quantityInCart = cartProduct.quantity;

      console.log(`Verificando stock para el producto ${product.name}...`);

      if (product.stock < quantityInCart) {
        console.log(`No hay suficiente stock para el producto ${product.name}`);
        return { error: `No hay suficiente stock para el producto ${product.name}` };
      }
    }

    // Actualizar el stock de cada producto y crear el ticket de compra
    const ticketProducts = [];
    let totalAmount = 0;

    for (const cartProduct of cart.products) {
      const product = cartProduct.product;
      const quantityInCart = cartProduct.quantity;

      console.log(`Actualizando stock para el producto ${product.name}...`);

      // Actualizar el stock del producto
      product.stock -= quantityInCart;
      await product.save();

      // Agregar el producto al ticket
      ticketProducts.push({
        product: product._id,
        quantity: quantityInCart
      });

      // Calcular el monto total de la compra
      totalAmount += product.price * quantityInCart;
    }

    console.log("Creando el ticket de compra...");

    // Crear el ticket de compra
    const newTicket = {
      code: generateUniqueCode(), // Implementa tu propia función para generar un código único
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: userId // Utiliza la información de usuario autenticado para el comprador
    };
    const ticket = await Ticket.create(newTicket);

    console.log("Ticket creado:", ticket);

    // Limpiar el carrito después de la compra
    cart.products = [];
    await cart.save();

    console.log("Compra realizada exitosamente");

    return { status: "success", message: "Compra realizada exitosamente", ticket: ticket };
  } catch (error) {
    console.error("Error al procesar la compra:", error);
    return { error: "Error al procesar la compra" };
  }
}







async function getAllCarts(req, res) {
  try {
    const carts = await dbCartService.getCarts();
    res.json({ carts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getCartById(req, res) {
  const { cartId } = req.params;
  console.log('el id del carrito es:',  cartId )

  try {
    const cart = await dbCartService.getCartById(cartId);

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
    const newCart = await dbCartService.createCart();
    res.json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function addProductToCart(req, res) {
  const { cartId } = req.params;
  const { productId, quantity } = req.body;

  try {
    const updatedCart = await dbCartService.addProductToCart(cartId, productId, quantity);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteCart(req, res) {
  const { cartId } = req.params;

  try {
    await dbCartService.deleteCart(cartId);
    res.json({ message: `Carrito con ID ${cartId} eliminado correctamente` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteProductFromCart(req, res) {
  const { cartId, productId } = req.params;

  try {
    await dbCartService.deleteProductFromCart(cartId, productId);
    res.json({ message: `Producto con ID ${productId} eliminado del carrito con ID ${cartId} exitosamente` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateCart(req, res) {
  const { cartId } = req.params;
  const updatedProducts = req.body;

  try {
    const updatedCart = await dbCartService.updateCart(cartId, updatedProducts);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateProductQuantity(req, res) {
  const { cartId, productId } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCart = await dbCartService.updateProductQuantity(cartId, productId, quantity);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteAllProductsFromCart(req, res) {
  const { cartId } = req.params;

  try {
    await dbCartService.deleteAllProductsFromCart(cartId);
    res.json({ message: `Todos los productos del carrito con ID ${cartId} han sido eliminados` });
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
  deleteAllProductsFromCart,
  
};
