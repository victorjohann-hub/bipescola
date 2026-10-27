import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import userRoutes from './src/routes/userRoutes.js';
import parentRoutes from './src/routes/parentRoutes.js';
import admRoutes from './src/routes/admRoutes.js';
import professorRoutes from './src/routes/professorRoutes.js';
import studentRoutes from './src/routes/studentRoutes.js';
import attendanceRoutes from './src/routes/attendanceRoutes.js';
import postRoutes from './src/routes/postRoutes.js';
import classRoutes from './src/routes/classRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/adms', admRoutes);
app.use('/api/professors', professorRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendances', attendanceRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/class', classRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/turmas', classRoutes);

const webDistDir = fileURLToPath(new URL('../mobile/dist', import.meta.url));
const webIndexFile = path.join(webDistDir, 'index.html');

// Serve arquivos estáticos do build Web (quando compilado via `npx expo export --platform web`)
app.use(express.static(webDistDir, { index: false }));

app.get('/', (req, res) => {
    const acceptHeader = req.headers.accept || '';
    if (acceptHeader.includes('text/html') && fs.existsSync(webIndexFile)) {
        return res.sendFile(webIndexFile);
    }
    res.status(200).json({ msg: "Bem-vindo" });
});

// 404 handler para rotas não mapeadas
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware centralizado de tratamento de erros
app.use((err, req, res, next) => {
    const status = err.status || (err.type === 'entity.parse.failed' ? 400 : 500);
    res.status(status).json({
        error: err.message || 'Erro interno do servidor'
    });
});

export default app;
