//Server
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import swaggerUi from "swagger-ui-express";
import mongoose from 'mongoose';
import passport from 'passport';
import { __dirname } from './utils.js';

//Managers
import ProductManager from './dao/managers/ProductManager.js';

//Models
import messageModel from './dao/models/message.model.js';
import productModel from './dao/models/product.model.js';

//Configs
import { errorHandler } from './midleware/errorHandler.js';
import { config } from "./config/config.js";
import { addLogger, devLogger, prodLogger } from './config/logger.js';
import { swaggerSpecs } from './config/docConfig.js';

//Routes
import dbProductsRouters from './routes/dbProducts.routes.js';
import dbCartsRoutes from './routes/dbCarts.routes.js';
import { dbMessageRouters } from './routes/dbMessages.routes.js';
import { sessionRoutes } from './routes/sessions.routes.js';
import inicializePassport from './config/passport.config.js';
import mockRouter from './routes/mockRouter.js';
import { usersRouter } from './routes/users.routes.js';
import viewRouters from './routes/views.routes.js';


console.log(config)
const app = express();
const PORT = process.env.PORT||8096;

app.use(express.json());
app.use(errorHandler); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))

/* const MONGO = "mongodb+srv://codermate2:skatemylife2@codermate2.atlvl2t.mongodb.net/ecomerce"
 */

const connection = mongoose.connect(process.env.MONGO_URL);


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
app.use(passport.session());


app.engine('handlebars', engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
}));

app.use('/api', mockRouter);
app.use('/', viewRouters);
app.use('/api/sessions', sessionRoutes)
app.use("/api/users", usersRouter);


app.use('/api/dbproducts', dbProductsRouters);
app.use('/api/dbcarts', dbCartsRoutes);
app.use('/api/dbmessage', dbMessageRouters);


app.use("/api/docs",swaggerUi.serve, swaggerUi.setup(swaggerSpecs));



app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');


const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`);
});

app.use(addLogger);

app.get('/loggerTest', (req, res) => {
  req.logger.debug('Mensaje de debug');
  req.logger.http('Mensaje HTTP');
  req.logger.info('Mensaje de información');
  req.logger.warn('Mensaje de advertencia');
  req.logger.error('Mensaje de error');
  req.logger.fatal('Mensaje fatal');

  res.send('Logs probados. Verifica la consola o los archivos de registro según la configuración del entorno.');
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
