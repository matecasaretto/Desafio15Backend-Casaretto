import messageModel from '../dao/models/message.model.js';

async function getAllMessages(req, res) {
  try {
    const messages = await messageModel.find();
    res.send({ messages });
  } catch (error) {
    console.error('Error al obtener la lista de mensajes:', error.message);
    res.status(500).send('Error interno del servidor');
  }
}

export { getAllMessages };
