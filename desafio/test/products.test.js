import mongoose from "mongoose";
import { DbProductManager } from "../src/dao/managers/dbProductManager.js";
import productModel from "../src/dao/models/product.model.js";
import assert from "assert";

const MONGO_URL="mongodb+srv://codermate2:skatemylife2@codermate2.atlvl2t.mongodb.net/ecomerce"

describe("Testing para la clase Products", () => {
    let dbProductManager;

    before(async function () {
        this.timeout(10000); 
        await mongoose.connect(MONGO_URL);
        dbProductManager = new DbProductManager();
    });

    after(async function () {
        await mongoose.disconnect();
    });

    it("El método consultarProductos debe obtener todos los productos en formato de array", async function () {
        const options = {}; 
        const query = null; 
        const category = null; 
        const sortOrder = null; 

        const result = await dbProductManager.consultarProductos(options, query, category, sortOrder);

        console.log(result)
        
        assert.strictEqual(Array.isArray(result), true);
    });

});
