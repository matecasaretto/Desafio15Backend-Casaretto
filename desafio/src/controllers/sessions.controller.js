// Importar el modelo de usuario y otros módulos necesarios
import User from "../dao/models/user.model.js";
import cartModel from "../dao/models/cart.model.js";
import { createHash } from "../utils.js";
import MaillingService from '../services/mailing.js';
import { validatePassword } from "../utils.js";

const mailer = new MaillingService();

async function register(req, res) {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({
        status: "error",
        error: "Usuario no encontrado"
      });
    }

    if (email === "fumet23@gmail.com" && password === "12345") {
      user.role = "premium";
    } else if (email === "adminCoder@coder.com" && password === "adminCoder123") {
      user.role = "admin";
    } else {
      user.role = "user";
    } 

    const newCart = new cartModel(); 
    await newCart.save(); 
    user.cart = newCart._id;

    await user.save(); 

    const from = 'CoderTes'; 
    const userEmail = user.email; 
    const to = [userEmail, 'fumet23@gmail.com']; 
    const subject = 'Confirmación de registro'; 
    const html = '<p>¡Gracias por registrarte en nuestra aplicación!</p>';

    await mailer.sendSimpleMail(from, to, subject, html);

    res.send({
      status: "success",
      message: "Usuario registrado exitosamente"
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).send({
      status: "error",
      error: "Error en el registro"
    });
  }
}


async function login(req, res) {
  try {
      if (!req.user) {
          return res.status(400).send({ status: "error", message: "Usuario no autenticado" });
      }

      const user = req.user;

      const existingUser = await User.findById(user._id);
      if (!existingUser) {
          return res.status(400).send({ status: "error", message: "Usuario no encontrado en la base de datos" });
      }

      let cartInfo = null;
      if (user.cart) {
          const cart = await cartModel.findById(user.cart).populate('products.product');
          if (cart) {
              cartInfo = cart._id;
          }
      }

      existingUser.login();
      await existingUser.save();

      req.session.user = {
          first_name: existingUser.first_name,
          last_name: existingUser.last_name,
          age: existingUser.age,
          email: existingUser.email,
          role: existingUser.role,
          cart: cartInfo,
      };

      res.send({
          status: "success",
          payload: req.session.user,
          redirect: "/"  
      });
  } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      alert("Contrase;a o email invalidos")
      res.status(500).send({
          status: "error",
          error: "Error en la verificación del rol o al obtener información del carrito"
      });
  }
}

export { register, login };
