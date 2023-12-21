import { Router } from "express";
import { DbCartManager } from "../dao/managers/dbCartManager.js";

const router = Router();
const cartManager = new DbCartManager();


router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.json({ carts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cartId", async (req, res) => {
  const { cartId } = req.params;

  try {
    const cart = await cartManager.getCartById(cartId);

    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: `Carrito con ID ${cartId} no encontrado` });
    }
  } catch (error) {
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


export { router as dbCartsRouters };
