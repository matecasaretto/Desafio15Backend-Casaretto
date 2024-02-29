import {Faker, es, en} from "@faker-js/faker"

export const customFaker = new Faker({locale: [en]})

const {commerce, image, database, string, internet, person, phone, lorem} = customFaker;

const generateFakeProduct = () => {
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

export { generateFakeProduct };