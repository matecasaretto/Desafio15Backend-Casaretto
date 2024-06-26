import { dbProductService } from "../repository/index.js";
import { errorHandler } from "../midleware/errorHandler.js";
import { EError } from "../enums/EError.js";
import { CustomError } from "../services/customError.service.js";
import { generateProductParam } from "../services/productErrorParam.js";
import productModel from "../dao/models/product.model.js";


async function getAllProducts(req, res) {
  try {
    const { limit = 10, page = 1, query, order, category } = req.query;

    const options = {
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      sort: getOrderSort(order),
    };

    const result = await dbProductService.getAllProducts(options, query, category);

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
}

async function addProduct(req, res) {
  const newProduct = req.body;

  try {
    newProduct.owner = req.user.email;
    const createdProduct = await dbProductService.addProduct(newProduct);
    res.json(createdProduct);
  } catch (error) {
    if (error.code === EError.PRODUCT_CREATION_ERROR) {
      res.status(400).json({ error: 'Error al crear el producto en la base de datos: ' + error.message });
    } else {
      res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
  }
}

async function getProductById(req, res) {
  const { productId } = req.params;

  try {
    const product = await dbProductService.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: `Producto con ID ${productId} no encontrado` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteProductById(req, res) {
  const { productId } = req.params;

  try {
    await dbProductService.deleteProductById(productId);
    res.json({ message: `Producto con ID ${productId} eliminado exitosamente` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateProduct(req, res) {
  const { productId } = req.params;
  const updatedProduct = req.body;

  try {
    await dbProductService.updateProduct(productId, updatedProduct);
    res.json({ message: `Producto con ID ${productId} actualizado exitosamente` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function getOrderSort(order) {
  if (order === "desc") {
    return { price: -1 }; 
  } else {
    return { price: 1 }; 
  }
}

export { getAllProducts, addProduct, getProductById, deleteProductById, updateProduct };
