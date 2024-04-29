function deleteCart() {
    const confirmDelete = confirm('¿Estás seguro de querer vaciar el carrito?');

    if (confirmDelete) {
        const form = document.getElementById('deleteCartForm');
        const action = form.getAttribute('action');

        fetch(action, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                console.error('Error al vaciar el carrito');
                alert('Hubo un error al vaciar el carrito. Por favor, inténtalo de nuevo.');
            }
        })
        .catch(error => {
            console.error('Error al vaciar el carrito:', error);
            alert('Hubo un error al vaciar el carrito. Por favor, inténtalo de nuevo.');
        });
    }
}

