import { Router } from "express";
import { DbCartManager } from "../dao/managers/dbCartManager.js";
import cartModel from "../dao/models/cart.model.js";
import productModel from "../dao/models/product.model.js";

const router = Router();
const cartManager = new DbCartManager();


router.get("/", async (req, res) => {
  try {
    const carts = await cartModel.find().populate('products.product');
    res.json({ carts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});;

router.get("/:cartId", async (req, res) => {
  const { cartId } = req.params;

  try {
    const cart = await cartModel
      .findOne({ id: cartId })
      .populate('products.product');

    console.log('Cart before populate:', cart);

    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: `Carrito con ID ${cartId} no encontrado` });
    }
  } catch (error) {
    console.error('Error en la ruta /api/carts/:cartId:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:cartId/products", async (req, res) => {
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
});

router.delete("/:cartId", async (req, res) => {
  const { cartId } = req.params;

  try {
    const deleted = await cartManager.deleteCart(cartId);

    if (deleted) {
      res.json({ message: `Carrito con ID ${cartId} eliminado exitosamente` });
    } else {
      res.status(404).json({ error: `Carrito con ID ${cartId} no encontrado` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cartId/products/:productId", async (req, res) => {
  const { cartId, productId } = req.params;

  try {
    const cart = await cartManager.deleteProductFromCart(cartId, productId);

    res.json({ message: `Producto con ID ${productId} eliminado del carrito con ID ${cartId} exitosamente`, cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:cartId", async (req, res) => {
  const { cartId } = req.params;
  const updatedProducts = req.body;

  try {
    const updatedCart = await cartManager.updateCart(cartId, updatedProducts);
    res.json(updatedCart);
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Manejar errores de validación
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      res.status(400).json({ error: 'Validation failed', details: validationErrors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

router.put("/:cartId/products/:productId", async (req, res) => {
  // Extrae los parámetros de la solicitud
  const { cartId, productId } = req.params;
  const { quantity } = req.body;

  try {
    // Llama al método para actualizar la cantidad del producto en el carrito
    const updatedCart = await cartManager.updateProductQuantity(cartId, productId, quantity);

    // Responde con el carrito actualizado
    res.json(updatedCart);
  } catch (error) {
    // En caso de error, responde con un código de estado 500 y el mensaje de error
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cartId/products", async (req, res) => {
  const { cartId } = req.params;

  try {
    const cart = await cartModel.findOne({ id: cartId });

    if (cart) {
      // Vacía el array de productos en el carrito
      cart.products = [];
      await cart.save();

      res.json({ message: `Todos los productos del carrito con ID ${cartId} han sido eliminados` });
    } else {
      res.status(404).json({ error: `Carrito con ID ${cartId} no encontrado` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export { router as dbCartsRouters };
