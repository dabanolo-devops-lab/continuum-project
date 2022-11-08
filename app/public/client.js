// const socket = io('http://localhost:3000');
const socket = io('http://3.134.48.58:3000');



socket.on('connect', () => {
    console.log('Connected to server id: ' + socket.id);
});

socket.on('user-connected', name => {
    console.log(name + ' connected');
});

socket.on('chat-message', data => {
    publishMessage(data.name + ': ' + data.message);
});

socket.on('user-disconnected', name => {
    console.log(name + ' disconnected');
});

socket.emit('new-user', `User ${socket.id}`);

const publishMessage = msg => {
    // create new element to append to the DOM
    const newMessage = document.createElement('p');
    // set the element with an id with time reference
    newMessage.id = Date.now().toString;
    // set the element with the message
    newMessage.innerText = msg;
    // append the element to the DOM
    document.getElementById('chat-messages').appendChild(newMessage);
}

// Getting the message from the chat input box
document.getElementById('chat-form').addEventListener('submit', e => {
    e.preventDefault();
    const msg = document.getElementById('chat-input').value;
    socket.emit('send-chat-message', msg);
    publishMessage(msg);
    document.getElementById('chat-input').value = '';
    
})