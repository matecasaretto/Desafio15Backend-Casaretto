import userModel from "../dao/models/user.model.js";
import cartModel from "../dao/models/cart.model.js";
import { createHash } from "../utils.js";
import MaillingService from '../services/mailing.js';


const mailer = new MaillingService();

async function register(req, res) {
  try {
    const { email, password } = req.body;

    // Buscar el usuario por correo electrónico
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).send({
        status: "error",
        error: "Usuario no encontrado"
      });
    }

    // Verificar si es un usuario admin
    if (email === "adminCoder@coder.com" && password === "adminCoder123") {
      user.role = "admin";
    } else {
      user.role = "user";
    }

    // Crear un nuevo carrito para el usuario
    const newCart = new cartModel(); 
    await newCart.save(); 
    user.cart = newCart._id; 

    // Guardar los cambios en el usuario
    await user.save(); 

    // Enviar correo electrónico de confirmación de registro
    const from = 'CoderTes'; // Dirección de correo del remitente
    const to = 'fumet23@gmail.com'; // Dirección de correo del destinatario (correo del usuario registrado)
    const subject = 'Confirmación de registro'; // Asunto del correo
    const html = '<p>¡Gracias por registrarte en nuestra aplicación!</p>'; // Contenido HTML del correo

    // Enviar el correo electrónico utilizando el servicio de mailing
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