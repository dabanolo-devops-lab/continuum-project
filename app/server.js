import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';


const __dirname = path.resolve();
const __filename = fileURLToPath(import.meta.url);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    },
});
const port = 3000;

let appUsers = {};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const index = path.join(__dirname, 'index.html');
    res.sendFile(index);
});


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

httpServer.listen(port, () => {
    // get dirname

    console.log(`Listening on port ${port}`);
    console.log(`__dirname: ${__dirname}`);
    console.log(`__filename: ${__filename}`);
    // console.log(`process.cwd(): ${process.cwd()}`);
    // console.log(`process.argv: ${process.argv}`);
    // console.log(`process.execPath: ${process.execPath}`);
    // console.log(`process.execArgv: ${process.execArgv}`);
    // console.log(`process.env: ${process.env}`);
    // console.log(`process.version: ${process.version}`);
    // console.log(`process.versions: ${process.versions}`);
    // console.log(`process.config: ${process.config}`);
    // console.log(`process.pid: ${process.pid}`);
});