/**
 * Chat interface elements
 */
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');

/**
 * Handles sending user messages
 * Displays user message and triggers chatbot response
 */
function sendMessage() {
    const message = userInput.value.trim();
    if (!message) {
        return;
    }
    // Display user's message
    displayMessage('user', message);
    // Call OpenAI API to get chatbot's response
    getChatbotResponse(message);
    // Clear user input
    userInput.value = '';
}

/**
 * Displays a message in the chat interface
 * @param {string} sender - The sender of the message ('user' or 'chatbot')
 * @param {string} message - The message content to display
 */
function displayMessage(sender, message) {
    if (!sender || !message) {
        console.error('Invalid message parameters');
        return;
    }
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    
    const messageParagraph = document.createElement('p');
    messageParagraph.innerText = message;
    
    messageElement.appendChild(messageParagraph);
    chatLog.appendChild(messageElement);
    
    // Auto-scroll to the bottom of the chat
    chatLog.scrollTop = chatLog.scrollHeight;
}

/**
 * Makes API request to get chatbot response
 * @param {string} userMessage - The user's message to process
 * @returns {Promise<void>}
 */
function getChatbotResponse(userMessage) {
    // Show loading indicator
    const loadingMessage = 'Thinking...';
    const loadingId = Date.now();
    displayMessage('chatbot', loadingMessage);

    fetch('/getChatbotResponse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Remove loading message
        const loadingElement = chatLog.lastElementChild;
        if (loadingElement && loadingElement.textContent === loadingMessage) {
            chatLog.removeChild(loadingElement);
        }
        // Display chatbot's response
        displayMessage('chatbot', data.chatbotResponse);
    })
    .catch(error => {
        console.error('Error:', error);
        // Remove loading message
        const loadingElement = chatLog.lastElementChild;
        if (loadingElement && loadingElement.textContent === loadingMessage) {
            chatLog.removeChild(loadingElement);
        }
        // Display error message to user
        displayMessage('chatbot', 'Sorry, I encountered an error. Please try again.');
    });
}

// Add event listener for Enter key
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});