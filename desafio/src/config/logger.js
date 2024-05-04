import winston from "winston";
import dotenv from "dotenv";
import path from "path";

import { __dirname } from "../utils.js";

dotenv.config();

const customLevels = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warn: 3,
        error: 4,
        fatal: 5
    },
    colors: {
        fatal: "red",
        error: "orange",
        warn: "yellow",
        info: "blue",
        http: "green",
        debug: "pink"
    }
};

const devLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({ level: "debug" }) 
    ]
});

const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({ level: "info" }),
        new winston.transports.File({ filename: path.join(__dirname, "/logs/errors.log"), level: "error" }) // Registrar errores en archivo
    ]
});


const addLogger = (req, res, next) => {
    const currentEnv = process.env.NODE_ENV || "development";
    if (currentEnv === "development") {
        req.logger = devLogger;
        console.log("DEV");
    } else {
        req.logger = prodLogger;
        console.log("PROD");
    }
    req.logger.http(`${req.url} - method: ${req.method}`);
    next();
};

export { devLogger, prodLogger, addLogger };
