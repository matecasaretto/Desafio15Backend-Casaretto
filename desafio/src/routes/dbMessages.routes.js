import { Router } from 'express';
import { getAllMessages } from '../controllers/dbMessages.controller.js';

const router = Router();

// Ruta para obtener todos los mensajes
router.get('/', getAllMessages);

export { router as dbMessageRouters };
