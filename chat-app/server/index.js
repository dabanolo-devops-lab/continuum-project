import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { handler } from '../build/handler.js';

const port = process.env.PORT || 3000;

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer);

let appUsers = {};

app.use(handler);

io.on('connection', (socket) => {
  socket.emit('eventFromServer', 'Hello from client');

  socket.on('new-user', username => {
    appUsers[socket.id] = username;
    socket.broadcast.emit('user-connected', username);
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: socket.id })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', socket.id)
    delete appUsers[socket.id];
  })
})



httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});



// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//     const index = path.join(__dirname, 'index.html');
//     res.sendFile(index);
// });


export default httpServer;


