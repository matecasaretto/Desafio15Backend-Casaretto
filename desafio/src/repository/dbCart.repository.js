import cartModel from '../dao/models/cart.model.js';
import productModel from '../dao/models/product.model.js';

class DbCartRepository {
    constructor() {
        
    }

    async getCarts() {
        try {
            const carts = await cartModel.find();
            return carts;
        } catch (error) {
            console.error('Error al obtener carritos desde MongoDB:', error.message);
            throw error;
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            console.log('ID del carrito:', cartId);
            console.log('ID del producto a eliminar:', productId);
          
            const cart = await cartModel.findOne({ _id: cartId });
            console.log('Carrito encontrado:', cart);
          
            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado.`);
            }
      
            const index = cart.products.findIndex((p) => p.product.toString() === productId.toString());
            console.log('Índice del producto en el carrito:', index);
          
            if (index === -1) {
                throw new Error(`Producto con ID ${productId} no encontrado en el carrito.`);
            }
      
            cart.products.splice(index, 1); 
            console.log('Producto eliminado del carrito');
          
            await cart.save();
          
            return cart;
        } catch (error) {
            console.error(`Error al eliminar el producto del carrito: ${error.message}`);
            throw error;
        }
    }

    async createCart() {
        try {
            const lastCart = await cartModel.findOne().sort({ _id: -1 });

            const newCartId = lastCart ? lastCart._id + 1 : 1;

            const newCart = new cartModel({
                _id: newCartId,
                products: [],
            });

            await newCart.save();

            return newCart;
        } catch (error) {
            console.error('Error al crear un nuevo carrito en MongoDB:', error.message);
            throw error;
        }
    }

    async getProductsInCart(cartId) {
        try {
            const cart = await cartModel.findOne({ _id: cartId });

            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado.`);
            }

            return cart.products;
        } catch (error) {
            console.error('Error al obtener productos del carrito en MongoDB:', error.message);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await cartModel.findById(cartId);
    
            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado.`);
            }
    
            const existingProduct = cart.products.find(item => item.product && item.product._id.equals(productId));
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                const product = await productModel.findById(productId);
                if (!product) {
                    throw new Error(`Producto con ID ${productId} no encontrado.`);
                }
    
                cart.products.push({ product: product._id, quantity: quantity });
            }
    
            await cart.save();
    
            const populatedCart = await cartModel.findById(cartId).populate('products.product').lean();
    
            return populatedCart;
        } catch (error) {
            console.error('Error al agregar un producto al carrito en el servicio:', error.message);
            throw error;
        }
    }

    async deleteCart(cartId) {
        try {
            const result = await cartModel.deleteOne({ _id: cartId });

            if (result.deletedCount > 0) {
                console.log(`Carrito con ID ${cartId} eliminado exitosamente`);
                return true;
            } else {
                throw new Error(`Carrito con ID ${cartId} no encontrado.`);
            }
        } catch (error) {
            console.error(`Error al eliminar el carrito con ID ${cartId}: ${error.message}`);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await cartModel.findOne({ _id: cartId });
        
            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado.`);
            }
        
            return cart;
        } catch (error) {
            console.error(`Error al obtener el carrito con ID ${cartId}: ${error.message}`);
            throw error;
        }
    }

    async deleteAllProductsFromCart(cartId) {
        try {
            const cart = await cartModel.findOne({ _id: cartId });
            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado.`);
            }
            cart.products = [];
            await cart.save();
            console.log(`Todos los productos del carrito con ID ${cartId} han sido eliminados`);
            return cart;
        } catch (error) {
            console.error(`Error al eliminar todos los productos del carrito con ID ${cartId}: ${error.message}`);
            throw error;
        }
    }

    async updateCart(cartId, updatedProducts) {
        try {
            const cart = await cartModel.findOne({ _id: cartId });
            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado.`);
            }
            cart.products = updatedProducts;
            await cart.save();
            return cart;
        } catch (error) {
            console.error(`Error al actualizar el carrito con ID ${cartId}: ${error.message}`);
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await cartModel.findOne({ _id: cartId });
        
            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado.`);
            }
        
            const product = cart.products.find((p) => p.product.toString() === productId.toString());
        
            if (!product) {
                throw new Error(`Producto con ID ${productId} no encontrado en el carrito.`);
            }
        
            if (typeof newQuantity !== 'number' || newQuantity < 0) {
                throw new Error('La cantidad debe ser un número positivo.');
            }
            
            product.quantity = newQuantity;
        
            await cart.save();
        
            return cart;
        } catch (error) {
            console.error(`Error al actualizar la cantidad del producto en el carrito: ${error.message}`);
            throw error;
        }
    }
}

export { DbCartRepository };
