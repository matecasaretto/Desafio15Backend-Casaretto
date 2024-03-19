import { Router } from "express";
import { getAllProducts, addProduct, getProductById, deleteProductById, updateProduct } from "../controllers/dbProducts.controller.js";
import { checkRole } from '../midleware/authorizationMiddleware.js'; 

const router = Router();

router.get("/", getAllProducts);
router.post("/", checkRole('premium'), addProduct); 
router.get("/:productId", getProductById);
router.delete("/:productId",checkRole('admin'), deleteProductById); 
router.put("/:productId", updateProduct); 

export default router;
