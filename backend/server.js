import os from 'node:os';
import app from './app.js';
import { getConnection } from './src/database/db.js';

const port = process.env.PORT || 3000;

function getLocalIpAddresses() {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name] || []) {
            if (net.family === 'IPv4' && !net.internal) {
                addresses.push(net.address);
            }
        }
    }
    return addresses;
}

async function startServer() {
    try {
        const connection = await getConnection();
        try {
            await connection.ping();
            console.log('Conexão com o banco de dados estabelecida.');
        } finally {
            connection.release();
        }

        app.listen(port, '0.0.0.0', () => {
            console.log(`Servidor rodando na porta ${port}.`);
            console.log(`- Acesso Local: http://localhost:${port}`);
            const ips = getLocalIpAddresses();
            ips.forEach((ip) => {
                console.log(`- Acesso na Rede (Wi-Fi): http://${ip}:${port}`);
            });
        });
    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados:', error.message);
        process.exit(1);
    }
}

startServer();