import express from 'express';
import { checkRole } from '../midleware/authorizationMiddleware.js';

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
  resetPassword
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
router.get('/carts/:cartId', dbCart);
router.get('/realtimeproducts', realTimeProducts);
router.get('/chat', checkRole('user'), chat);
router.get('/register', publicAccess, register);
router.get('/login', publicAccess, login);
router.get('/profile', profile);
router.get('/resetPassword', resetPassword);

export default router;
