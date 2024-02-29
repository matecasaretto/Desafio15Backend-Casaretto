import { Router } from 'express';
import { getAllMessages } from '../controllers/dbMessages.controller.js';

const router = Router();

router.get('/', getAllMessages);

export { router as dbMessageRouters };
