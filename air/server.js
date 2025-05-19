const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');
const express = require('express');

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('signup', ({ email, password }) => {
      console.log('Signup data:', email, password);
    });

  });

  server.use((req, res) => {
    return handle(req, res);
  });

  httpServer.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
