const userData = document.getElementById('userData');
const cartId = userData.dataset.cartId;

const buttons = document.querySelectorAll('input[type="submit"]');

buttons.forEach(button => {
    button.addEventListener("click", async function (event) {
        event.preventDefault();

        const productId = button.parentNode.querySelector('input[name="productId"]').value;
        const quantityInput = button.parentNode.querySelector('input[name="quantity"]');
        const quantity = parseInt(quantityInput.value); 

        try {
            const response = await fetch(`/api/dbcarts/${cartId}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId, quantity })
            });

            if (!response.ok) {
                throw new Error('No se pudo agregar el producto al carrito');
            }

           
            const updatedCart = await response.json();

            
            if (updatedCart) {
                const product = updatedCart.products.find(item => item.product._id === productId);
                if (product) {
                    quantityInput.value = product.quantity; 
                }
            }

            alert('Producto agregado al carrito exitosamente. Para finalizar la compra, ve a "Carrito" en el navegador.');
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
        }
    });
});
