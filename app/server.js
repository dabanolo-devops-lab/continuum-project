import { Server } from 'socket.io';


const io = new Server(3000, {
    cors: {
        origin: '*',
    },
});

let appUsers = {};

io.on('connection', (socket) => {

    socket.on('new-user', username => {
        appUsers[socket.id] = username;
        socket.broadcast.emit('user-connected', username);
    })
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: appUsers[socket.id] })
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', appUsers[socket.id])
        delete appUsers[socket.id];
    })

});