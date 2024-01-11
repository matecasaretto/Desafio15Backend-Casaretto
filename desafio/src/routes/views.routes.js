import express from 'express';
import { DbProductManager } from '../dao/managers/dbProductManager.js';
import { DbCartManager } from '../dao/managers/dbCartManager.js';

const router = express.Router();
const cartManager = new DbCartManager();
const productManager = new DbProductManager(); 

const publicAccess = (req, res, next) =>{
  if(req.session.user){
      return res.redirect('/');
  }
  next();
}

const privateAccess = (req, res, next) =>{
  if(!req.session.user){
      return res.redirect('/login');
  }
  next();
}

router.get('/', privateAccess, async (req, res) => {
  try {
    const products = await productManager.consultarProductos();
    
    res.render('home', { products, user: req.session.user }); 
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

router.post('/carts/:cartId/add-to-cart', async (req, res) => {
  const cartId = req.params.cartId;
  const productId = req.body.productId; 
  
  res.json({ message: 'Producto agregado al carrito con éxito' });
});

router.get('/dbproducts', async (req, res) => {
  try {
    const { limit = 5, page = 1, order, category } = req.query;

    
    const options = {
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      sort: order === 'desc' ? { price: -1 } : { price: 1 },
    };

    const result = await productManager.consultarProductos(options, null, category);

    const response = {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/dbproducts?limit=${limit}&page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/dbproducts?limit=${limit}&page=${result.nextPage}` : null,
    };
    res.render('dbproducts', { products: response });
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/carts/:cartId', async (req, res) => {
  const { cartId } = req.params;

  try {
    const cart = await cartManager.getCartById(cartId);

    if (cart) {
      res.render('dbCart', { cart });
    } else {
      res.status(404).json({ error: `Carrito con ID ${cartId} no encontrado` });
    }
  } catch (error) {
    console.error('Error al obtener detalles del carrito:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});


router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts'); 
});

router.get('/chat', (req, res) => {
  res.render('chat'); 
});

//sessions

router.get('/register', publicAccess, (req,res)=>{
  res.render('register')
})

router.get('/login', publicAccess, (req,res)=>{
  res.render('login')
})

router.get('/profile', (req, res) => {
  console.log('Datos del usuario en /profile:', req.session.user);
  res.render('profile', { user: req.session.user });
});

export default router;
