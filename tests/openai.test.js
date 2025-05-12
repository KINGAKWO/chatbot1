const { OpenAIAPI } = require('../openai');

describe('OpenAIAPI', () => {
    test('should handle empty message', async () => {
        const response = await OpenAIAPI.generateResponse('');
        expect(response).toBe('An error occurred while processing your request.');
    });

    test('should handle valid message', async () => {
        const response = await OpenAIAPI.generateResponse('Hello');
        expect(typeof response).toBe('string');
        expect(response.length).toBeGreaterThan(0);
    });
});