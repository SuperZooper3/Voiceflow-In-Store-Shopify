document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
  
    function appendMessage(message, sender) {
      const messageDiv = document.createElement('div');
      messageDiv.className = sender;
      messageDiv.textContent = message;
      chatBox.appendChild(messageDiv);
      chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    }
  
    function sendMessage() {
      const message = chatInput.value;
      if (message.trim() === '') return;
  
      appendMessage(message, 'user');
      chatInput.value = '';

      appendMessage('I am a bot. This isnt Voieflow.', 'bot');
  
    //   // Send the message to the server
    //   fetch('https://your-external-server.com/api/chat', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ message: message })
    //   })
    //   .then(response => response.json())
    //   .then(data => {
    //     if (data.reply) {
    //       appendMessage(data.reply, 'bot');
    //     }
    //   })
    //   .catch(error => {
    //     console.error('Error:', error);
    //   });
    }
  
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        sendMessage();
      }
    });
});
  