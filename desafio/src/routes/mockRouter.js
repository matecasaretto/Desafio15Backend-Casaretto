import express from 'express';
import { generateMockProducts } from '../controllers/mockController.js';

const router = express.Router();

// Ruta para generar productos falsos
router.get('/mockingproducts', generateMockProducts);

export default router;