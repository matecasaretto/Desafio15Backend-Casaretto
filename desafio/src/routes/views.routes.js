import express from 'express';
import { verifyEmailTokenMW } from '../midleware/authorizationMiddleware.js';
import { authenticateRole } from '../midleware/authorizationMiddleware.js';
import { getAllProducts } from '../controllers/dbProducts.controller.js';
import cartModel from '../dao/models/cart.model.js';
import User from '../dao/models/user.model.js';
import { showCart } from '../controllers/dbCarts.controller.js';

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


router.get('/', privateAccess, home);
router.post('/carts/:cartId/add-to-cart', addToCart);
router.get('/dbproducts', dbProducts);
router.get('/carts/:cartId', showCart);
router.get('/realtimeproducts', realTimeProducts);
router.get('/chat', authenticateRole('user'), chat); 
router.get('/register', publicAccess, register);
router.get('/login', publicAccess, login);
router.get('/profile', profile);




router.get('/forgot-password', (req,res)=>{
  res.render("forgotPassword")
})
router.get('/reset-password',(req,res)=>{
  const token = req.query.token
  res.render("resetPassword",{token})
})

export default router;