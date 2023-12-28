document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
  
    const messageList = document.getElementById('message-list');
    const messageForm = document.getElementById('message-form');
  
    messageForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = document.getElementById('user').value;
      const message = document.getElementById('message').value;
  
      
      socket.emit('sendMessage', { user, message });
  
      
      document.getElementById('message').value = '';
    });
  
  
    socket.on('message', (data) => {
      const li = document.createElement('li');
      li.textContent = `${data.user}: ${data.message}`;
      messageList.appendChild(li);
    });
  
    socket.on('newMessage', (data) => {
      const li = document.createElement('li');
      li.textContent = `${data.user}: ${data.message}`;
      messageList.appendChild(li);
    });
  });
  