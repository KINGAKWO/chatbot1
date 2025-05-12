/**
 * Express server configuration for the chatbot application
 * @module server
 */

require('dotenv').config();

// process.env["NODE_TLS_REJECT_UNAUTHORIZED"]=0; // <--- REMOVE THIS LINE
const express = require('express');
const path = require('path');
const { OpenAIAPI } = require('./openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

/**
 * @route GET /
 * @description Serves the main chat interface
 * @returns {HTML} The index.html file
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * @route POST /getChatbotResponse
 * @description Processes user messages and returns chatbot responses
 * @param {Object} req.body.userMessage - The message from the user
 * @returns {Object} JSON object containing the chatbot's response
 * @throws {400} If message is missing
 * @throws {500} If internal server error occurs
 */
app.post('/getChatbotResponse', async (req, res) => {
    try {
        const userMessage = req.body.userMessage;
        if (!userMessage) {
            return res.status(400).json({ error: 'Message is required' });
        }
        const chatbotResponse = await OpenAIAPI.generateResponse(userMessage);
        res.json({ chatbotResponse });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Only start the server if this file is run directly
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = app;