// src/routes/sessions.routes.js

import { Router } from "express";
import passport from "passport";
import { register, login } from "../controllers/sessions.controller.js";

const router = new Router();

// Endpoint para registro de usuario
router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }), register);

// Endpoint para manejar el fallo en el registro
router.get("/failregister", async (req, res) => {
  console.log('Fallo el registro');
  res.send({ error: 'fallo en el registro' });
});

// Endpoint para inicio de sesión
router.post("/login", passport.authenticate("login", { failureRedirect: '/api/sessions/faillogin' }), login);

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
  const user = await userModel.findOne({email});
  if(!user) return res.status(400).send(
    res.send({
      status:"error",
      message:"No existe el usuario"
    })
  )
  const newHashPassword = createHash(password);

  await userModel.updateOne({_id:user._id},{$set:{password:newHashPassword}});
  res.send({
    status:"success",
    message:"contraseña restaurada"
  })
});

// Endpoint para obtener el usuario actual
router.get("/current", (req, res) => {
  try {
    if (req.session && req.session.user) {
      res.status(200).json({
        status: "success",
        user: req.session.user
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

export { router as sessionRoutes };
