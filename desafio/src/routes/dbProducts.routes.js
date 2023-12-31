// Importa las bibliotecas necesarias y el modelo
import { Router } from "express";
import { DbProductManager } from "../dao/managers/dbProductManager.js";

const router = Router();
const productManager = new DbProductManager();


router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, query, order, category } = req.query;


    const options = {
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      sort: getOrderSort(order),
    };

    const result = await productManager.consultarProductos(options, query, category);

    const response = {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/dbproducts?limit=${limit}&page=${result.prevPage}&order=${order}&category=${category}` : null,
      nextLink: result.hasNextPage ? `/api/dbproducts?limit=${limit}&page=${result.nextPage}&order=${order}&category=${category}` : null,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});


router.post("/", async (req, res) => {
  const newProduct = req.body;

  try {
    const createdProduct = await productManager.addProduct(newProduct);
    io.emit('realTimeProductsUpdate', { products: 'lista actualizada de productos' });
    res.json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await productManager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: `Producto con ID ${productId} no encontrado` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    await productManager.deleteProduct(productId);
    res.json({ message: `Producto con ID ${productId} eliminado exitosamente` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/:productId", async (req, res) => {
  const { productId } = req.params;
  const updatedProduct = req.body;

  try {
    await productManager.updateProduct(productId, updatedProduct);
    res.json({ message: `Producto con ID ${productId} actualizado exitosamente` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


function getOrderSort(order) {
  if (order === "desc") {
    return { price: -1 }; 
  } else {
    return { price: 1 }; 
  }
}

export { router as dbProductsRouters };
