const request = require('supertest');
const app = require('../server');

describe('Server API', () => {
    let server;

    beforeAll(() => {
        server = app.listen(0); // Use any available port
    });

    afterAll((done) => {
        server.close(done);
    });

    test('GET / should serve index.html', async () => {
        const response = await request(server).get('/');
        expect(response.status).toBe(200);
        expect(response.type).toMatch(/html/);
    });

    test('POST /getChatbotResponse should handle valid input', async () => {
        const response = await request(server)
            .post('/getChatbotResponse')
            .send({ userMessage: 'Hello' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('chatbotResponse');
    });

    test('POST /getChatbotResponse should handle empty input', async () => {
        const response = await request(server)
            .post('/getChatbotResponse')
            .send({ userMessage: '' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});