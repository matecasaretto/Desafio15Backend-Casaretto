import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";

import userModel from "../dao/models/user.model.js";
import cartModel from "../dao/models/cart.model.js";
import { createHash, validatePassword } from "../utils.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use("register", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
            const { first_name, last_name, age } = req.body;
            try {
                let user = await userModel.findOne({ email });
                if (user) {
                    console.log('Usuario ya registrado');
                    return done(null, false, { message: 'El usuario ya está registrado' });
                }
  
                const newCart = new cartModel();
                await newCart.save();
  
                const newUser = new userModel({
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    role: "user", // Cambiar de "Usuario" a "user"
                    cart: newCart._id,
                });
  
                const result = await newUser.save();
                return done(null, result);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use("login", new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
          try {
              const user = await userModel.findOne({ email });
              if (!user) {
                  return done(null, false, { message: "Usuario no encontrado" });
              }
  
              if (!validatePassword(password, user)) {
                  return done(null, false, { message: "Contraseña incorrecta" });
              }
  
              return done(null, user);
          } catch (error) {
              return done(error);
          }
      }
  ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });

    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.3a7d347f0b78bbff",
        clientSecret: "f1cad553be3ba163af89f65fb46a327ffa3e8168",
        callbackURL: "http://localhost:8096/api/sessions/githubcallback"
    }, async(accesToken, refreshToken, profile, done) => {
        try {
            console.log(profile._json.name);
            const first_name = profile._json.name
            let email;
            if (!profile._json.email) {
                email = profile.username
            }

            let user = await userModel.findOne({ email: profile._json.email });
            if (user) {
                console.log('Usuario ya registrado');
                return done(null, false);
            }

            const newUser = new userModel({
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                role: "user", 
                cart: newCart._id,
            });

            const result = await userModel.create(newUser);
            return done (null, result);

        } catch (error) {
            return done(error)
        }
    }));
};

export default initializePassport;