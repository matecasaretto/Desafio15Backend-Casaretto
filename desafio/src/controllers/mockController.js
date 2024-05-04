import { generateFakeProduct } from '../config/faker.js';

const generateMockProducts = (req, res) => {
    const numberOfProducts = 100; 
    const mockProducts = [];

    for (let i = 0; i < numberOfProducts; i++) {
        mockProducts.push(generateFakeProduct());
    }
    res.json(mockProducts);
};

export { generateMockProducts };
