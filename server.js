const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const Database = require('./database/database');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Inicializar banco de dados
const db = new Database();

// Rotas da API
app.use('/api', require('./api/routes'));

// Servir aplicativos
app.use('/customer', express.static(path.join(__dirname, 'apps/customer')));
app.use('/pos', express.static(path.join(__dirname, 'apps/pos')));
app.use('/kitchen', express.static(path.join(__dirname, 'apps/kitchen')));
app.use('/delivery', express.static(path.join(__dirname, 'apps/delivery')));
app.use('/admin', express.static(path.join(__dirname, 'apps/admin')));
app.use('/management', express.static(path.join(__dirname, 'apps/management')));

// WebSocket para atualizações em tempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  
  socket.on('join-room', (room) => {
    socket.join(room);
  });
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Disponibilizar io globalmente
global.io = io;

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`BiteOS rodando na porta ${PORT}`);
  console.log(`Apps disponíveis em:`);
  console.log(`- Cliente: http://localhost:${PORT}/customer`);
  console.log(`- PDV: http://localhost:${PORT}/pos`);
  console.log(`- Cozinha: http://localhost:${PORT}/kitchen`);
  console.log(`- Entregador: http://localhost:${PORT}/delivery`);
  console.log(`- Admin: http://localhost:${PORT}/admin`);
  console.log(`- Gerencial: http://localhost:${PORT}/management`);
});