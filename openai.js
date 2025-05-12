//const { OpenAIAPIKey }= require('./config');

/**
 * OpenAIAPI class for handling OpenAI API interactions
 * @class
 */
class OpenAIAPI {
    /** @private */
    static #apiKeys = null;
    /** @private */
    static #currentKeyIndex = 0;

    /**
     * Initializes API keys from environment variables
     * Supports multiple API keys with OPENAI_API_KEY_* pattern
     * Falls back to OPENAI_API_KEY if no numbered keys found
     * @private
     */
    static initializeApiKeys() {
        if (!this.#apiKeys) {
            this.#apiKeys = Object.entries(process.env)
                .filter(([key]) => key.startsWith('OPENAI_API_KEY_'))
                .map(([_, value]) => value);
            
            if (this.#apiKeys.length === 0) {
                // Fallback to the default key if no numbered keys are found
                const defaultKey = process.env.OPENAI_API_KEY;
                if (defaultKey) {
                    this.#apiKeys = [defaultKey];
                }
            }
        }
    }

    /**
     * Gets the next available API key using round-robin rotation
     * @private
     * @returns {string} The next API key to use
     * @throws {Error} If no API keys are configured
     */
    static getNextApiKey() {
        this.initializeApiKeys();
        if (!this.#apiKeys || this.#apiKeys.length === 0) {
            throw new Error('No OpenAI API keys configured');
        }
        const key = this.#apiKeys[this.#currentKeyIndex];
        this.#currentKeyIndex = (this.#currentKeyIndex + 1) % this.#apiKeys.length;
        return key;
    }

    /**
     * Generates a response using OpenAI's chat completion API
     * @param {string} userMessage - The user's input message
     * @param {Array<Object>} [conversationHistory=[]] - Previous conversation messages
     * @returns {Promise<string>} The chatbot's response
     */
    static async generateResponse(userMessage, conversationHistory = []) {
        try {
            const apiKey = this.getNextApiKey();
            if (!apiKey) {
                throw new Error('OpenAI API key is not configured');
            }
            const endpoint = 'https://api.openai.com/v1/chat/completions';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo-1106",
                    messages: conversationHistory.concat([{ role: 'user', content: userMessage }]),
                    max_tokens: 150
                }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const responseData = await response.json();
        // Log the entire API response for debugging
        console.log('Response from OpenAI API:', responseData.choices[0].message);
        // Check if choices array is defined and not empty
        if (responseData.choices && responseData.choices.length > 0 && responseData.choices[0].message) {
            return responseData.choices[0].message.content;
        } else {
            // Handle the case where choices array is undefined or empty
            console.error('Error: No valid response from OpenAI API');
            return 'Sorry, I couldn\'t understand that.';
        }
        } catch (error) {
            console.error('Error in OpenAI API call:', error);
            return 'An error occurred while processing your request.';
        }
    }
}
module.exports = { OpenAIAPI };