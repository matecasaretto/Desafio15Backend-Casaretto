import { Router } from "express";
import { getAllProducts, addProduct, getProductById, deleteProductById, updateProduct } from "../controllers/dbProducts.controller.js";
import { authenticateRole } from "../midleware/authorizationMiddleware.js";
import { authorizeProductModification } from "../midleware/authorizationMiddleware.js";
import { authorizeProductDeletion } from "../midleware/authorizationMiddleware.js";


const router = Router();

router.get("/", getAllProducts);
router.post("/", /* authenticateRole('premium') */ addProduct); 
router.get("/:productId", getProductById);
router.delete("/:productId", authenticateRole('premium'), authorizeProductDeletion, deleteProductById);
router.put("/:productId", authorizeProductModification, updateProduct);

export default router;
