import fs from 'node:fs';
import request from 'supertest';
import app from '../app.js';

describe('App', () => {
    it('deve retornar 200 e a mensagem de boas-vindas na rota raiz para chamadas de API', async () => {
        const res = await request(app).get('/').set('Accept', 'application/json');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('msg', 'Bem-vindo');
    });

    it('deve servir o Web App (HTML) na rota raiz quando solicitado por navegador e build existir', async () => {
        const res = await request(app).get('/').set('Accept', 'text/html');
        expect(res.statusCode).toEqual(200);
        if (fs.existsSync(new URL('../../mobile/dist/index.html', import.meta.url))) {
            expect(res.headers['content-type']).toMatch(/text\/html/);
        } else {
            expect(res.body).toHaveProperty('msg', 'Bem-vindo');
        }
    });
});
