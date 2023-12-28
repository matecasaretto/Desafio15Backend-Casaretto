function obtenerCartId() {
   
    return 'cart123';
  }
  

  function addToCart(productId) {
    const cartId = obtenerCartId();
  
    if (!cartId) {
      console.error('Error: cartId no válido');
      return;
    }
  
    fetch(`/api/dbcarts/${cartId}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: productId,
        quantity: 1, 
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Producto agregado al carrito:', data);
      })
      .catch(error => {
        console.error('Error al agregar al carrito:', error);
      });
  }
  
  