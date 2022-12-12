<script lang="ts">
  import { io } from 'socket.io-client';

  const socket = io()

  socket.on('eventFromServer', (data) => {
    console.log(data)
  })

  socket.on('connect', () => {
      console.log('Connected to server id: ' + socket.id);
  });

  socket.on('user-connected', name => {
      console.log(name + ' connected');
  });

  socket.on('chat-message', data => {
      publishMessage(data.message, data.name);
  });

  socket.on('user-disconnected', name => {
      console.log(name + ' disconnected');
  });

  socket.emit('new-user', `User ${socket.id}`);

  // const publishMessage = (msg: string, keyId: string) => {
  //     const newMessage = document.createElement('p');
  //     newMessage.id = Date.now().toString();
  //     newMessage.setAttribute('data-socket-id', `${keyId}`);
  //     newMessage.getAttribute('data-socket-id') === socket.id ? newMessage.className = 'user-message' : newMessage.className = 'other-message';
  //     newMessage.innerText = msg;
  //     document.getElementById('chat-messages').appendChild(newMessage);
  // }

  // Getting the message from the chat input box
  // document.getElementById('chat-form').addEventListener('submit', e => {
  //   e.preventDefault();
  //   const msg = document.getElementById('chat-input').value;
  //   socket.emit('send-chat-message', msg);
  //   publishMessage(msg, socket.id);
  //   document.getElementById('chat-input').value = '';
      
  // })
  function publishMessage(msg: string, keyId: string) {
    const newMessage = document.createElement('p');
    newMessage.id = Date.now().toString();
    newMessage.setAttribute('data-socket-id', `${keyId}`);
    newMessage.getAttribute('data-socket-id') === socket.id ? newMessage.className = 'user-message' : newMessage.className = 'other-message';
    newMessage.innerText = msg;
    (<HTMLInputElement>document.getElementById('chat-messages')).appendChild(newMessage);
  }

  function sendMessage(e: { preventDefault: () => void; }) {
    e.preventDefault();
    const msg = (<HTMLInputElement>document.getElementById('chat-input')).value;
    if (msg){
      socket.emit('send-chat-message', msg);
      publishMessage(msg, socket.id);
      (<HTMLInputElement>document.getElementById('chat-input')).value = '';
    }
  }

</script>

<main class="container">

  <div class="sub-container">
    <section class="chat-container">
        <div class="chat-header">
            <h1>👻Boo! Ghost Chat👻 !!!</h1>
        </div>
        <div id="chat-messages"></div>
        <div class="chat-form-container">
            <form id="chat-form" on:submit={sendMessage}>
                <input id="chat-input" type="text" placeholder="Enter Message" required autocomplete="off">
                <input type="button" value="Send" class="btn">
            </form>
        </div>
    </section>
  </div>

  
</main>

<style>
  :global(*),
  :global(*::after),
  :global(*::before){
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    font-size:inherit;
    scroll-behavior: smooth;
  }
  :global(:root){
    font-size: 62.5%;
    box-sizing: inherit;
    font-family: 'JetBrains Mono', monospace;
  }
  .container{
    width: 100vw;
    height: 100vh;
    background: rgb(255,226,44);
    background: linear-gradient(90deg, rgba(255,226,44,1) 0%, rgba(255,167,36,1) 100%);
  }

  .sub-container{
    display: flex;
    height: 100vh;
    opacity: 0;
    animation: fadeIn ease 1s;
    animation-iteration-count: 1;
    animation-delay: .3s;
    animation-fill-mode: forwards;
  }

  .btn{
    border: none;
    border-radius: 100%;
    width: 5rem;
    height: 5rem;
    background-color: #2076fd;
    color: #fff;
    cursor: pointer;
  }
  #chat-input{
    height: 5rem;
    border: none;
    border-radius: 2.5rem;
    padding: 1rem 2rem;
    background-color: #f6f6f6;
    flex: auto;
    margin-right: 2rem;
  }
  .chat-container{
    font-size: 1.6rem;
    width: 45rem;
    padding: 2rem;
    margin: 10vh auto;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    border-radius: 1.2rem;
  }
  #chat-messages{
    display: flex;
    flex-flow: column nowrap;
    margin: 2rem 0;
    flex: auto;
    justify-content: flex-end;
    overflow-y: hidden;
  }
  :global(.user-message), :global(.other-message){
    display: flex;
    min-height: 5rem;
    text-align: left;
    align-self: flex-end;
    align-items: center;
    padding: 1rem 2rem;
    border-radius: 2.5rem;
    background-color: #cbdbf5;
    border-bottom-right-radius: 0;
    color: #0063ff;
  }
  :global(.other-message){
    background-color: #e9e9e9;
    border-top-left-radius: 0;
    border-bottom-right-radius: 2.5rem;
    align-self: flex-start;
    color: #000;
  }


  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  } 

  .chat-form-container {
    display: flex;
  }

  #chat-form {
    display: flex;
    width: 100%;
  }

  /* .container {
      display: flex;
      height: 100vh;
  } */
</style>