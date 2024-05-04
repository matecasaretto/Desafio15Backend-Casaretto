io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
  
    socket.on('renderProductsInDOM', (products) => {
      console.log('Productos para renderizar en el DOM:', products);
      
      res.render('realTimeProducts', { products }, (err, html) => {
        if (err) {
          console.error('Error al renderizar la vista:', err.message);
        } else {
         
          socket.emit('updateDOM', { html });
        }
      });
    });
  
   
  });
  