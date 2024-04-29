import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import User from "../dao/models/user.model.js";
import productModel from "../dao/models/product.model.js";


export const authenticateRole = (role) => {
    return async (req, res, next) => {
        try {
            const user = req.user; // Obtener el usuario de la sesión
            console.log('Información del usuario:', user); // Imprimir información sobre el usuario
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

export const authorizeProductModification = async (req, res, next) => {
    try {
        const user = req.user;
        const productId = req.params.productId;

        if (!user || !user._id) {
            throw new Error('Usuario no autenticado');
        }

        // Obtener el producto por su ID
        const product = await productModel.findById(productId);

        if (!product) {
            throw new Error('Producto no encontrado');
        }

        // Verificar si el usuario tiene permiso para modificar o eliminar el producto
        if (user.role === 'admin' || (user.role === 'premium' && product.owner === user.email)) {
            next();
        } else {
            throw new Error('No autorizado para modificar o eliminar este producto');
        }
    } catch (error) {
        console.error('Error en authorizeProductModification:', error.message);
        res.status(401).json({ error: error.message });
    }
};

export const authorizeProductDeletion = async (req, res, next) => {
    try {
        const user = req.user;
        const productId = req.params.productId;

        if (!user || !user._id) {
            throw new Error('Usuario no autenticado');
        }

        const product = await productModel.findById(productId);

        if (!product) {
            throw new Error('Producto no encontrado');
        }

        if (user.role === 'admin' || (user.role === 'premium' && product.owner === user.email)) {
            next();
        } else {
            throw new Error('No autorizado para eliminar este producto');
        }
    } catch (error) {
        console.error('Error en authorizeProductDeletion:', error.message);
        res.status(401).json({ error: error.message });
    }
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