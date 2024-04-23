import express from 'express';
import { verifyEmailTokenMW } from '../midleware/authorizationMiddleware.js';
import { authenticateRole } from '../midleware/authorizationMiddleware.js';
import { getAllProducts } from '../controllers/dbProducts.controller.js';
import cartModel from '../dao/models/cart.model.js';
import User from '../dao/models/user.model.js';

import {
  home,
  addToCart,
  dbProducts,
  dbCart,
  realTimeProducts,
  chat,
  register,
  login, 
  profile,
} from '../controllers/views.controller.js';

const router = express.Router();

const publicAccess = (req, res, next) =>{
  if(req.session.user){
      return res.redirect('/');
  }
  next();
};

const privateAccess = (req, res, next) =>{
  if(!req.session.user){
      return res.redirect('/login');
  }
  next();
};

router.get('/cart', (req, res) => {
  // Lógica para obtener los productos del carrito y renderizar la vista
  res.render('cart', { /* datos del carrito */ });
});

router.get('/', home);
router.post('/carts/:cartId/add-to-cart', addToCart);
router.get('/dbproducts', dbProducts);
router.get('/carts/:cartId', dbCart);
router.get('/realtimeproducts', realTimeProducts);
router.get('/chat', authenticateRole('user'), chat); 
router.get('/register', publicAccess, register);
router.get('/login', publicAccess, login);
router.get('/profile', profile);

// Ruta para manejar la solicitud GET para '/cart'
router.get('/cart', async (req, res) => {
  try {
    // Verificar si el usuario está autenticado y obtener su ID de usuario
    const userId = req.session.user; // Suponiendo que guardas el ID del usuario en la sesión

    // Buscar al usuario en la base de datos usando su ID
    const user = await User.findById(userId);

    if (!user) {
      // Manejar el caso en que el usuario no se encuentre
      return res.status(404).send('Usuario no encontrado');
    }

    // Obtener el ID del carrito asociado al usuario
    const cartId = user.cart;

    // Buscar el carrito en la base de datos usando el ID del carrito
    const cart = await cartModel.findById(cartId).populate('products.product');

    if (!cart) {
      // Manejar el caso en que el carrito no se encuentre
      return res.status(404).send('Carrito no encontrado');
    }

    // Pasar tanto los datos del usuario como del carrito a la vista de cart
    res.render('cart', { user, cart });
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).send('Error al obtener el carrito');
  }
});


router.get('/forgot-password', (req,res)=>{
  res.render("forgotPassword")
})
router.get('/reset-password',(req,res)=>{
  const token = req.query.token
  res.render("resetPassword",{token})
})

export default router;