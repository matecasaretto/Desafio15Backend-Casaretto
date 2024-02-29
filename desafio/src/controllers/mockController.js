import { generateFakeProduct } from '../config/faker.js';

// Controlador para generar productos falsos
const generateMockProducts = (req, res) => {
    const numberOfProducts = 100; // Número de productos a generar
    const mockProducts = [];

    // Generar los productos falsos
    for (let i = 0; i < numberOfProducts; i++) {
        mockProducts.push(generateFakeProduct());
    }

    // Devolver los productos falsos como respuesta
    res.json(mockProducts);
};

export { generateMockProducts };
