import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt"
import {Faker, es, en} from "@faker-js/faker"
import jwt from "jsonwebtoken"
import { config } from "./config/config.js";
import multer from "multer"
import { resolve } from "path";

export const customFaker = new Faker({locale: [en]})

const {commerce, image, database, string, internet, person, phone, lorem} = customFaker;

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);


export const generateProduct = () => {
    return {
        id: database.mongodbObjectId(),
        title: commerce.productName(),
        price: parseFloat(commerce.price()),
        department: commerce.department(),
        stock: parseInt(string.numeric(2)),
        image: image.url(),
        code: string.alphanumeric(10),
        description: commerce.productDescription()
    };
};


export const generateMockProducts = (count = 100) => {
    const products = [];
    for (let i = 0; i < count; i++) {
        products.push(generateProduct());
    }
    return products;
};


export const generateEmailToken = (email, expireTime) => {
    try {
        const token = jwt.sign({ email }, config.jwt.SECRET, { expiresIn: expireTime });
        console.log("Token generado:", token);
        return token;
    } catch (error) {
        console.log("Error al generar el token:", error.message);
        return null;
    }
};

export const verifyEmailToken = (token) => {
    try {
        const info = jwt.verify(token, config.jwt.SECRET);
        console.log(info);
        return info.email;
    } catch (error) {
        console.log(error.message);
        return null;
    }
};

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validatePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
  };
