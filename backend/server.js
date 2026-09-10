import express from 'express';

import userRoutes from './src/routes/userRoutes.js';

import cors from 'cors';

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ msg: "Bem-vindo" });
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}.`)
});