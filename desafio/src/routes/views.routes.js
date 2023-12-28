import express from 'express';
import { DbProductManager } from '../dao/managers/dbProductManager.js';
import { DbCartManager } from '../dao/managers/dbCartManager.js';



const router = express.Router();
const cartManager = new DbCartManager();
const productManager = new DbProductManager(); 

router.get('/', async (req, res) => {
  try {
    const products = await productManager.consultarProductos();

    res.render('home', { products });
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/dbproducts', async (req, res) => {
  try {
    const { limit = 5, page = 1, order, category } = req.query;

    // Configurar opciones de paginación y ordenamiento
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

export default router;
