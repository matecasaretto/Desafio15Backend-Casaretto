function deleteProductFromCart(cartId, productId) {
    fetch(`/api/dbcarts/cartId/products/${productId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            window.location.reload(); 
        } else {
            console.error('Error al eliminar el producto del carrito:', response.statusText);
            alert('Hubo un error al eliminar el producto del carrito. Por favor, inténtalo de nuevo.');
        }
    })
    .catch(error => {
        console.error('Error al eliminar el producto del carrito:', error.message);
        alert('Hubo un error al eliminar el producto del carrito. Por favor, inténtalo de nuevo.');
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const deleteProductForm = document.getElementById('deleteProductForm');

    deleteProductForm.addEventListener('submit', event => {
        event.preventDefault(); 

        const cartIdInput = document.getElementById('cartIdInput');
        const productIdInput = document.getElementById('productIdInput');

        const cartId = cartIdInput.value;
        const productId = productIdInput.value;

        deleteProductFromCart(cartId, productId);
    });
});
