import { DbProductManager } from '../dao/managers/dbProductManager.js';
import { DbCartManager } from '../dao/managers/dbCartManager.js';

const cartManager = new DbCartManager();
const productManager = new DbProductManager(); 

const home = async (req, res) => {
  try {
    const { limit = 10, page = 1, order, category } = req.query;

    const options = {
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      /* ort: getOrderSort(order) */
    };

    const products = await productManager.consultarProductos(options, null, category, order);

    // Construir los enlaces de paginación
    const prevLink = products.hasPrevPage ? `/api/dbproducts?limit=${limit}&page=${products.prevPage}&order=${order}&category=${category}` : null;
    const nextLink = products.hasNextPage ? `/api/dbproducts?limit=${limit}&page=${products.nextPage}&order=${order}&category=${category}` : null;

    res.render('home', { products, user: req.session.user, prevLink, nextLink }); 
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error.message);
    res.status(500).send('Error interno del servidor');
  }
};

async function addToCart(req, res) {
  const { cartId } = req.params;
  const { productId, quantity } = req.body;

  try {
    // Lógica para agregar el producto al carrito usando cartId, productId y quantity
    // Debes llamar a la función que agrega el producto al carrito aquí

    // Una vez que se haya agregado el producto al carrito, redirige al usuario a la vista del carrito
    res.redirect(`/carts/${cartId}`); // Ajusta la ruta según sea necesario
  } catch (error) {
    // Manejo de errores si ocurre algún problema al agregar el producto al carrito
    res.status(500).json({ error: error.message });
  }
}


const dbProducts = async (req, res) => {
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
};

const dbCart = async (req, res) => {
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
};

const realTimeProducts = (req, res) => {
  res.render('realTimeProducts'); 
};

const chat = (req, res) => {
  res.render('chat'); 
};

const register = (req, res) => {
  res.render('register');
};

const login = (req, res) => {
  res.render('login');
};

const profile = (req, res) => {
  console.log('Datos del usuario en /profile:', req.session.user);
  res.render('profile', { user: req.session.user });
};

const resetPassword = (req, res) => {
  res.render("resetPassword");
};

export {
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
};