import { Router } from "express";
import passport from "passport";
import { register, login } from "../controllers/sessions.controller.js";
import { GetUserDto } from "../dao/dto/user.dto.js";
import User from "../dao/models/user.model.js";



import { generateEmailToken, verifyEmailToken, isValidPassword, createHash } from "../utils.js";
import { sendRecoveryPass } from "../services/mailing.js";

const router = new Router();

// Endpoint para registro de usuario
router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }), register);

// Endpoint para manejar el fallo en el registro
router.get("/failregister", async (req, res) => {
  console.log('Fallo el registro');
  res.send({ error: 'fallo en el registro' });
});

// Endpoint para inicio de sesión
router.post("/login", passport.authenticate("login", { failureRedirect: '/api/sessions/faillogin' }), login);0

// Endpoint para manejar el fallo en el inicio de sesión
router.get("/faillogin",(req,res)=>{
  res.send({error:"fail login"})
});

// Endpoint para autenticación con GitHub
router.get("/github", passport.authenticate("github", { scope: ['user:email'] }), async (req,res)=>{});

// Endpoint para manejar la respuesta de autenticación con GitHub
router.get("/githubcallback", passport.authenticate("github", { failureRedirect: '/login' }), async (req,res)=>{
  req.session.user = req.user
  res.redirect("/")
});

// Endpoint para cerrar sesión
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

// Endpoint para reiniciar contraseña
router.post("/restartPassword", async (req,res)=>{
  const {email,password} = req.body;
  if(!email || !password) return res.status(400).send(
    res.send({
      status:"error",
      message:"Datos incorrectos"
    })
  )
  const user = await User.findOne({email});
  if(!user) return res.status(400).send(
    res.send({
      status:"error",
      message:"No existe el usuario"
    })
  )
  const newHashPassword = createHash(password);

  await user.updateOne({_id:user._id},{$set:{password:newHashPassword}});
  res.send({
    status:"success",
    message:"contraseña restaurada"
  })
});

// Endpoint para obtener el usuario actual
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

router.post("/reset-password", async (req,res)=>{
  try {
      const token = req.query.token;
      const {email, newPassword} = req.body;
      const validToken = verifyEmailToken(token);
      if(!validToken){
          return res.send(`El token ya no es valido`);
      }
      const user = await User.findOne({email});
      if(!user){
          return res.send("el Usuario no esta registrado")   
      }
      if(isValidPassword(newPassword,user)){
          return res.send("no se puede usar la misma contraseña")
      }
      const userData = {
          ...user._doc,
      }
      const updateUser = await User.findOneAndUpdate({email},userData);
      res.render("login", {message:"Contraseña actualizada"})
  } catch (error) {
      console.log(error);
      res.send(`<div>Error, hable con el administrador.</div>`)
  }

});

export { router as sessionRoutes };