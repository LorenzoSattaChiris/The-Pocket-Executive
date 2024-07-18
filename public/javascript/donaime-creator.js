document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const inputElement = document.getElementById('user-input');
    const message = inputElement.value.trim();
    if (message === '') return;

    addMessageToChat('user', message);
    inputElement.value = '';

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message, character, aiResponse })
        });

        const data = await response.json();
        addMessageToChat('ai', data.message);
    } catch (error) {
        console.error('Error sending message:', error);
        addMessageToChat('ai', 'An error occurred while generating the response.');
    }
}

function addMessageToChat(sender, message) {
    const messagesContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.innerText = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}