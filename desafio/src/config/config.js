import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Command } from "commander";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program.option("-mode <modo>", "Modo de inicio", "dev");
program.parse();

const environment =  program.opts();

dotenv.config();

export const config = {
    jwt:{
        COOKIE: process.env.JWT_COOKIE,
        SECRET: process.env.JWT_SECRET,
    },
    mailing:{
        SERVICE: process.env.MAILING_SERVICE,
        USER: process.env.MAILING_USER,
        PASSWORD: process.env.MAILING_PASSWORD
    },
    server: {
        port: process.env.PORT
    },
    mongo: {
        url: process.env.MONGO_URL
    },
    auth: {
        account: process.env.CORREO_ADMIN,
        pass: process.env.PASSWORD_ADMIN
    }
};


