import { Router } from "express";
import { purchaseCart, getAllCarts, getCartById, createCart, addProductToCart, deleteCart, deleteProductFromCart, updateCart, updateProductQuantity, deleteAllProductsFromCart } from "../controllers/dbCarts.controller.js";

const router = Router();

router.get("/", getAllCarts);
router.get("/:cartId", getCartById);
router.post("/", createCart);
router.post("/:cartId/products", addProductToCart);
router.delete("/:cartId", deleteCart);
router.delete("/:cartId/products/:productId", deleteProductFromCart);
router.put("/:cartId", updateCart);
router.put("/:cartId/products/:productId", updateProductQuantity);
router.delete("/:cartId/products", deleteAllProductsFromCart);
router.post("/:cartId/purchase", async (req, res) => {
    try {
      const cartId = req.params.cid;
      const userId = req.body.email; 
  
      const result = await purchaseCart(cartId, userId);
  
      if (result.error) {
        return res.status(400).json({ error: result.error });
      }
  
      res.status(200).json(result);
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      res.status(500).json({ error: "Error al procesar la compra" });
    }
  });

export default router;
