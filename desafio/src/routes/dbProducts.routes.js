import { Router } from "express";
import { DbProductManager } from "../dao/managers/dbProductManager.js";
import productModel from "../dao/models/product.model.js";

const router = Router();
const productManager = new DbProductManager(); // Crea una instancia de DbProductManager

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await productManager.consultarProductos();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar un nuevo producto
router.post("/", async (req, res) => {
  const newProduct = req.body;

  try {
    const createdProduct = await productManager.addProduct(newProduct);
    res.json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un producto por ID
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

// Eliminar un producto por ID
router.delete("/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    await productManager.deleteProduct(productId);
    res.json({ message: `Producto con ID ${productId} eliminado exitosamente` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un producto por ID
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

export { router as dbProductsRouters };
