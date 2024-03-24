import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import User from "../dao/models/user.model.js";


export const authenticateRole = (role) => {
    return (req, res, next) => {
        try {
            const user = req.user; // Obtener el usuario de la sesión
            if (!user || !user._id) { // Verificar que el usuario y su _id no sean undefined
                throw new Error('Usuario no autenticado');
            }
            // Realizar otras comprobaciones de roles si es necesario
            if (user.role !== role) {
                throw new Error('No autorizado');
            }
            next(); // Pasar al siguiente middleware si todo está bien
        } catch (error) {
            console.error('Error en authenticateRole:', error.message);
            res.status(401).json({ error: error.message });
        }
    };
};

export const verifyEmailTokenMW = () => {

    return (req,res,next) => {
        try {

            const jwtToken = req.query.token;
            const decoded = jwt.decode(jwtToken);
            const expTime = decoded.exp * 1000;
            const expDate = new Date(expTime);
            const currentDate = new Date()

            if(currentDate > expDate){
                return res.json({status:"error", message:"Token vencido"})
            }
            
        } catch (error) {
            return res.json({status:"error", message: "Error en el token"})
        }
        next()
    }

}