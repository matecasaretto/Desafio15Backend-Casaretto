import userModel from "../dao/models/user.model.js";
import cartModel from "../dao/models/cart.model.js";
import { createHash } from "../utils.js";

async function register(req, res) {
  try {
    if (req.body.email === "adminCoder@coder.com" && req.body.password === "adminCoder123") {
      req.user.role = "admin";
    }

    const newCart = new cartModel(); 
    await newCart.save(); 
    req.user.cart = newCart._id; 

    await req.user.save(); 

    res.send({
      status: "success",
      message: "Usuario registrado exitosamente"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      error: "Error en el registro"
    });
  }
}

async function login(req, res) {
  try {
    if (!req.user) {
      return res.status(400).send({ status: "error" });
    }

    if (req.user.email === "adminCoder@coder.com" && req.user.password === "adminCoder123") {
      req.user.role = "admin";
    }

    let cartInfo;
    if (req.user.cart) {
      const cart = await cartModel.findById(req.user.cart).populate('products.product');
      if (cart) {
        cartInfo = {
          id: cart._id,
        };
      }
    }
    console.log('Información del carrito:', cartInfo);
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
      cart: cartInfo, 
    };
    res.send({
      status: "success",
      payload: req.session.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      error: "Error en la verificación del rol o al obtener información del carrito"
    });
  }
}

export { register, login };
