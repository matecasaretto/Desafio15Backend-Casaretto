const buttons = document.querySelectorAll('input[type="submit"]');

buttons.forEach(button => {
    button.addEventListener("click", async function (event) {
        event.preventDefault(); 

        const productId = button.parentNode.querySelector('input[name="productId"]').value;
        const quantity = button.parentNode.querySelector('input[name="quantity"]').value;

        try {
            const response = await fetch(`/api/dbcarts/66282440757b2f94d3a96195/products`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId, quantity })
            });

            if (!response.ok) {
                throw new Error('No se pudo agregar el producto al carrito');
            }

            alert('Producto agregado al carrito exitosamente, para finalizar compra, dirijete a "carrito" dentro del navegador');
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
        }
    });
});