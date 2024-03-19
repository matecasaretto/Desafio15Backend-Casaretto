import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.json({ status: "error", message: "Necesitas estar autenticado" });
        }
        if (!roles.includes(req.user.role)) {
            return res.json({ status: "error", message: "No estás autorizado" });
        }
        next();
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