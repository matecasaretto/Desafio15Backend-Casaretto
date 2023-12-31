document.addEventListener('DOMContentLoaded', function () {
  const socket = io.connect('http://localhost:8096');

  socket.on('connect', function () {
    console.log('Conectado al servidor Socket.io');
  });

  socket.on('realTimeProductsUpdate', function (data) {
    console.log('Productos actualizados en tiempo real:', data.products);

    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    data.products.forEach(product => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <strong>${product.title}</strong>
        <p>${product.description}</p>
        <p>Precio: ${product.price}</p>
        <p>Stock: ${product.stock}</p>
      `;
      productList.appendChild(listItem);
    });
  });

  socket.on('error', function (error) {
    console.error('Error en la conexión Socket.io:', error);
  });
});

