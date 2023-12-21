import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from './utils.js';
import viewRouters from './routes/views.routes.js';
import { productsRouters } from './routes/products.routes.js';
import { cartRouter } from './routes/carts.routes.js';
import ProductManager from './dao/managers/ProductManager.js';
import mongoose from 'mongoose';
import messageModel from './dao/models/message.model.js';

import { dbProductsRouters } from './routes/dbProducts.routes.js';
import { dbCartsRouters } from './routes/dbCarts.routes.js';
import { dbMessageRouters } from './routes/dbMessages.routes.js';

const app = express();
const PORT = 8096;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGO = "mongodb+srv://codermate2:skatemylife2@codermate2.atlvl2t.mongodb.net/ecomerce"
const connection = mongoose.connect(MONGO)

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use('/', viewRouters);
app.use('/api/products', productsRouters);
app.use('/api/carts', cartRouter);
app.use('/api/dbproducts', dbProductsRouters);
app.use('/api/dbcarts', dbCartsRouters);
app.use('/api/dbmessage', dbMessageRouters);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`);
});

const io = new Server(httpServer);
const productManager = new ProductManager(io);

io.on('connection', async (socket) => {
  try {
    console.log('Nuevo cliente conectado');
    
    socket.on('sendMessage', async (data) => {
      
      try {
        const newMessage = await messageModel.create({ user: data.user, message: data.message });
        console.log('Nuevo mensaje guardado en la base de datos:', newMessage);

        io.emit('newMessage', { user: data.user, message: data.message });
      } catch (error) {
        console.error('Error al guardar el mensaje en la base de datos:', error.message);
      }
    });


  } catch (error) {
    console.error('Error en la conexión de socket:', error.message);
  }
});

export default app;
