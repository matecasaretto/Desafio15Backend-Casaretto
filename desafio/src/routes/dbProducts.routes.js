import { Router } from "express";
import { getAllProducts, addProduct, getProductById, deleteProductById, updateProduct } from "../controllers/dbProducts.controller.js";
import { authenticateRole } from "../midleware/authorizationMiddleware.js";


const router = Router();

router.get("/", authenticateRole('premium'), getAllProducts);
router.post("/", authenticateRole('premium'), addProduct); 
router.get("/:productId", getProductById);
router.delete("/:productId", deleteProductById); 
router.put("/:productId", updateProduct); 

export default router;
