import { dbCartService } from '../repository/index.js';
import { v4 as uuidv4 } from 'uuid';
import Ticket from '../dao/models/ticket.model.js';
import productModel from '../dao/models/product.model.js';
import { EError } from '../enums/EError.js';
import { CustomError } from '../services/customError.service.js';



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


export async function purchaseCart(req, res) {
  try {
    const cartId = req.params.cartId;
    console.log("Iniciando proceso de compra...");
    console.log("El ID del carrito es:", cartId);

    const cart = await dbCartService.getCartById(cartId);
    console.log("Carrito encontrado:", cart);

    if (!cart) {
      console.log("El carrito no existe");
      return res.status(404).json({ error: "El carrito no existe" });
    }

    for (const cartProduct of cart.products) {
      const product = await productModel.findById(cartProduct.product);
      console.log("Producto:", product); 
    
      const quantityInCart = cartProduct.quantity;
    
      console.log(`Verificando stock para el producto ${product.title}...`);
    
      if (product.stock < quantityInCart) {
        console.log(`No hay suficiente stock para el producto ${product.title}`);
        cartProduct.quantity = product.stock;
        await cart.save();
        return res.status(400).json({ error: `No hay suficiente stock para el producto ${product.title}. La cantidad máxima disponible es ${product.stock}` });
      }
    }

    const ticketProducts = [];
    let totalAmount = 0;

    for (const cartProduct of cart.products) {
      const product = await productModel.findById(cartProduct.product);
      const quantityInCart = cartProduct.quantity;

      console.log(`Actualizando stock para el producto ${product.title}...`);

      product.stock -= quantityInCart;
      await product.save();


      ticketProducts.push({
        product: product._id,
        quantity: quantityInCart
      });

      totalAmount += product.price * quantityInCart;
    }

    console.log("Creando el ticket de compra...");
    const newTicket = {
      code: generateUniqueCode(), 
      purchase_datetime: new Date(),
      amount: totalAmount,
    };
    const ticket = await Ticket.create(newTicket);

    console.log("Ticket creado:", ticket);

    cart.products = [];
    await cart.save();

    console.log("Compra realizada exitosamente");

    return res.status(200).json({ status: "success", message: "Compra realizada exitosamente", ticket: ticket });
  } catch (error) {
    console.error("Error al procesar la compra:", error);
    return res.status(500).json({ error: "Error al procesar la compra" });
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
  
  try {
    const cart = await dbCartService.getCartById(cartId);

    if (cart) {
      const products = await getProductDetails(cart.products);
    
      res.render('cart', { cart, products });
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
      throw CustomError.createError({ name: 'CartCreationError', message: 'Error al crear el carrito', errorCode: EError.CART_CREATION_ERROR, cause: error });
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
