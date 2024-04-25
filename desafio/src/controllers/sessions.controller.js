// Importar el modelo de usuario y otros módulos necesarios
import userModel from "../dao/models/user.model.js";
import cartModel from "../dao/models/cart.model.js";
import { createHash } from "../utils.js";
import MaillingService from '../services/mailing.js';

const mailer = new MaillingService();

async function register(req, res) {
  try {
    const { email, password } = req.body;

    
    let user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).send({
        status: "error",
        error: "Usuario no encontrado"
      });
    }

   
    if ((email === "adminCoder@coder.com" && password === "adminCoder123") ||
        (email === "usuarioPremium@premium.com" && password === "12345")) {
      user.role = (email === "adminCoder@coder.com") ? "admin" : "premium";
    } else {
      user.role = "user";
    }

   
    const newCart = new cartModel(); 
    await newCart.save(); 
    user.cart = newCart._id;

    
    await user.save(); 

   
    const from = 'CoderTes'; 
    const to = 'fumet23@gmail.com'; 
    const subject = 'Confirmación de registro'; 
    const html = '<p>¡Gracias por registrarte en nuestra aplicación!</p>';

    
    await mailer.sendSimpleMail(from, to, subject, html);

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

    let cartInfo;
if (req.user.cart) {
  const cart = await cartModel.findById(req.user.cart).populate('products.product');
  if (cart) {
    cartInfo = cart._id; 
  } else {
    cartInfo = null; 
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
