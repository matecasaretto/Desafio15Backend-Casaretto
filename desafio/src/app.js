import express from 'express';
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from './utils.js';
import viewRouters from './routes/views.routes.js';
import { productsRouters } from './routes/products.routes.js';
import { cartRouter } from './routes/carts.routes.js';
import ProductManager from './dao/managers/ProductManager.js';
import mongoose from 'mongoose';
import messageModel from './dao/models/message.model.js';
import productModel from './dao/models/product.model.js';
import passport from 'passport';
import mockRouter from './routes/mockRouter.js';

import {config} from "./config/config.js"

import dbProductsRouters from './routes/dbProducts.routes.js';
import dbCartsRoutes from './routes/dbCarts.routes.js';
import { dbMessageRouters } from './routes/dbMessages.routes.js';
import { sessionRoutes } from './routes/sessions.routes.js';
import inicializePassport from './config/passport.config.js';

console.log(config)
const app = express();
const PORT = config.server.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))

/* const MONGO = "mongodb+srv://codermate2:skatemylife2@codermate2.atlvl2t.mongodb.net/ecomerce"
 */
const connection = mongoose.connect(config.mongo.url);


app.use(session({
  store: new MongoStore({
    mongoUrl: config.mongo.url,
    ttl: 3600
  }),
  secret: "CoderSecret",
  resave: false,
  saveUninitialized: false
}))

inicializePassport()
app.use(passport.initialize());
app.use(passport.session())


app.engine('handlebars', engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use('/api', mockRouter);
app.use('/', viewRouters);
app.use('/api/products', productsRouters);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionRoutes)

app.use('/api/dbproducts', dbProductsRouters);
app.use('/api/dbcarts', dbCartsRoutes);
app.use('/api/dbmessage', dbMessageRouters);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`);
});

const io = new Server(httpServer);
const productManager = new ProductManager(io);


io.on('connection', async (socket) => {
  try {
    console.log('Nuevo cliente conectado');

    const getUpdatedProducts = async () => {
      try {
        const updatedProducts = await productModel.find({}).lean();
        return updatedProducts;
      } catch (error) {
        console.error('Error al obtener productos actualizados:', error.message);
        throw error;
      }
    };

    socket.on('sendMessage', async (data) => {
      try {
        console.log('Mensaje recibido:', data);

        const newMessage = await messageModel.create({ user: data.user, message: data.message });
        console.log('Nuevo mensaje guardado en la base de datos:', newMessage);

        io.emit('newMessage', { user: data.user, message: data.message });
      } catch (error) {
        console.error('Error al guardar el mensaje en la base de datos:', error.message);
      }
    });

    const updatedProducts = await getUpdatedProducts();
    io.emit('realTimeProductsUpdate', { products: updatedProducts });
  } catch (error) {
    console.error('Error en la conexión de socket:', error.message);
  }
});




export default app;
