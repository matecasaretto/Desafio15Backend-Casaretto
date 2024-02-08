import { Router } from "express";
import { getAllProducts, createProduct, getProductById, deleteProductById, updateProduct } from "../controllers/dbProducts.controller.js";

const router = Router();

router.get("/", getAllProducts);
router.post("/", createProduct);
router.get("/:productId", getProductById);
router.delete("/:productId", deleteProductById);
router.put("/:productId", updateProduct);

export default router;