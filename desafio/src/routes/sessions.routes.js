import {Router} from "express";
import userModel from "../dao/models/user.model.js";
import { createHash, validatePassword } from "../utils.js";
import passport from "passport";

const router = new Router();



router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }),
async (req, res) => {
    try {
        // Verificar si el nuevo usuario tiene el correo y contraseña específicos
        if (req.body.email === "adminCoder@coder.com" && req.body.password === "adminCoder123") {
            req.user.role = "admin";
        }

        // Guardar el usuario en la base de datos
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
);
router.get("/failregister", async (req,res)=>{
    console.log('Fallo el registro');
    res.send({error: 'fallo en el registro'})
})


router.post("/login", passport.authenticate("login", { failureRedirect: '/api/sessions/faillogin' }),
    async (req, res) => {
        try {
            if (!req.user) {
                return res.status(400).send({ status: "error" });
            }

            // Verificar el rol del usuario después de la autenticación
            if (req.user.email === "adminCoder@coder.com" && req.user.password === "adminCoder123") {
                req.user.role = "admin";
            }

            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                age: req.user.age,
                email: req.user.email,
                role: req.user.role
            };

            res.send({
                status: "success",
                payload: req.session.user
            });
        } catch (error) {
            // Manejar cualquier error que pueda ocurrir durante la verificación del rol
            console.error(error);
            res.status(500).send({
                status: "error",
                error: "Error en la verificación del rol"
            });
        }
    }
);

router.get("/faillogin",(req,res)=>{
    res.send({error:"fail login"})
})

router.get("/github", passport.authenticate("github", {scope:['user:email']}), async (req,res)=>{})

router.get("/githubcallback", passport.authenticate("github", {failureRedirect:'/login'}), async (req,res)=>{
    req.session.user = req.user
    res.redirect("/")
})


router.get("/logout", (req,res)=>{
    req.session.destroy(err=>{
        if(err){
            return res.status(500).send({
                status: 'error',
                error: 'Cierre de sesion fallido'
            })
        }
        res.redirect('/login')
    })
})

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
})

export { router as sessionRoutes };
