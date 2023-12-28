import { Router } from 'express';
import messageModel from '../dao/models/message.model.js';

const router = Router();


router.get('/', async (req, res) => {
  try {
    const messages = await messageModel.find();
    res.send({ messages });
  } catch (error) {
    console.error('Error al obtener la lista de mensajes:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

export { router as dbMessageRouters };
