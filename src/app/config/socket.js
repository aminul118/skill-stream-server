const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'https://skill-stream-client.vercel.app',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  console.log('⚡ Socket.io initialized');

  io.on('connection', (socket) => {
    console.log('🔗 New client connected:', socket.id);

    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`👤 User joined room: ${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('🔥 Client disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIO };
