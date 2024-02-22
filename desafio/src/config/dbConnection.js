import mongoose from "mongoose";
import { config } from "./config.js"


export const connectDB = async () =>{
    try{
        await mongoose.connect(config.mongo.url)
        console.log('Conectado a la Data Base')
    }catch (error) {
        console.log(`Hubo un error al conectar la Data Base, el error: ${error}`)
    }
}