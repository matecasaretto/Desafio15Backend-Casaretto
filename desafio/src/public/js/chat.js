document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
  
    const messageList = document.getElementById('message-list');
    const messageForm = document.getElementById('message-form');
  
    messageForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = document.getElementById('user').value;
      const message = document.getElementById('message').value;
  
      // Enviar el mensaje al servidor
      socket.emit('sendMessage', { user, message });
  
      // Limpiar el campo de mensaje
      document.getElementById('message').value = '';
    });
  
    // Manejar mensajes en tiempo real
    socket.on('message', (data) => {
      const li = document.createElement('li');
      li.textContent = `${data.user}: ${data.message}`;
      messageList.appendChild(li);
    });
  
    // También puedes escuchar eventos de nuevos mensajes y agregarlos a la lista
    socket.on('newMessage', (data) => {
      const li = document.createElement('li');
      li.textContent = `${data.user}: ${data.message}`;
      messageList.appendChild(li);
    });
  });
  