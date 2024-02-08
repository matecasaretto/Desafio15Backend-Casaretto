import { Router } from "express";
import { getAllCarts, getCartById, createCart, addProductToCart, deleteCart, deleteProductFromCart, updateCart, updateProductQuantity, deleteAllProductsFromCart } from "../controllers/dbCarts.controller.js";

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

export default router;
