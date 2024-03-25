import { __dirname } from "../utils.js";
import swaggerJsDoc from "swagger-jsdoc"
import path from "path"

const swaggerOptions = {
    definition:{
        openapi:"3.0.1",
        info:{
            title:"Documentacion api Backend Coder",
            version:"1.0.0",
            description:"Definicion de endpoints para la API de Coder"
        }
    },
    apis:[`${path.join(__dirname,"../docs/**/*.yaml")}`], //Aqui van los archivos
};

export const swaggerSpecs = swaggerJsDoc(swaggerOptions);
