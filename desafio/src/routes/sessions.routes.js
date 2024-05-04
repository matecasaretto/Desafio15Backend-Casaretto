import { Router } from "express";
import passport from "passport";
import { register, login } from "../controllers/sessions.controller.js";
import { GetUserDto } from "../dao/dto/user.dto.js";
import User from "../dao/models/user.model.js";
import { createHash } from "../utils.js";

import { generateEmailToken, verifyEmailToken, validatePassword } from "../utils.js";
import { sendRecoveryPass } from "../services/mailing.js";

const router = new Router();

router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }), register);

router.get("/failregister", async (req, res) => {
  console.log('Fallo el registro');
  res.send({ error: 'fallo en el registro' });
});

router.post("/login", passport.authenticate("login", { failureRedirect: '/api/sessions/faillogin' }), login);

router.get("/faillogin",(req,res)=>{
  res.send({error:"fail login"})
});

router.get("/github", passport.authenticate("github", { scope: ['user:email'] }), async (req,res)=>{});

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: '/login' }), async (req,res)=>{
  req.session.user = req.user
  res.redirect("/")
});

router.get("/logout", (req,res)=>{
  req.session.destroy(err=>{
    if(err){
      return res.status(500).send({
        status: 'error',
        error: 'Cierre de sesión fallido'
      })
    }
    res.redirect('/login')
  })
});

router.get("/current", (req, res) => {
  try {
    if (req.session && req.session.user) {
      const userDTO = new GetUserDto(req.session.user);
      res.status(200).json({
        status: "success",
        user: userDTO
      });
    } else {
      res.status(401).json({
        status: "error",
        message: "No hay sesión de usuario activa"
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener el usuario actual"
    });
  }
});

router.post("/forgot-password", async (req,res)=>{
  try {
      const {email} = req.body;
      const user = await User.findOne({email});
      if(!user){
          res.send(`<div>Error no existe el usuario, vuelva a intentar: <a href="/forgot-password">Intente de nuevo</a></div>`)
      }
      const token = generateEmailToken(email, 60*3);
      console.log(Object);
      await sendRecoveryPass(email, token);
      res.send("Se envio el correo de recuperacion.")
  } catch (error) {
      res.send(`<div>Error,<a href="/forgot-password">Intente de nuevo</a></div>`)
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const token = req.query.token;
    const { email, newPassword } = req.body;
    const validToken = verifyEmailToken(token);
    if (!validToken) {
      return res.send(`El token ya no es válido`);
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.send("El usuario no está registrado");
    }
  
    const newPasswordHashed = createHash(newPassword); 
    user.password = newPasswordHashed; 
    await user.save(); 

    res.render("login", { message: "Contraseña actualizada" });
    console.log("Contraseña actualizada");
  } catch (error) {
    console.log(error);
    res.send(`<div>Error, hable con el administrador.</div>`);
  }
});



export { router as sessionRoutes };