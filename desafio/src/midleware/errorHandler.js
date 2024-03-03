import { EError } from "../enums/EError.js";

export const errorHandler = (error, req, res, next) =>{
    switch (error.code) {
        case EError.AUTH_ERROR:
            res.json({ status: "error", error: error.cause, message: error.message });
            break;
        case EError.DATABASE_ERROR:
            res.json({ status: "error", message: error.message });
            break;
        case EError.INVALID_PARAM:
            res.json({ status: "error", error: error.cause });
            break;
        case EError.PRODUCT_CREATION_ERROR:
            res.json({ status: "error", message: "Error al crear el producto en la base de datos" });
            break;
        case EError.CART_CREATION_ERROR:
            res.json({ status: "error", message: "Error al crear el carrito en la base de datos" });
            break;
        default:
            res.json({ status: "error", message: "Ocurrió un error" });
            break;
    }
}
