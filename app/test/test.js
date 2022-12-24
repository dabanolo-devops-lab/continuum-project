'use strict';

import { expect, assert } from 'chai';
import { describe, it } from 'mocha';
import httpServer from '../server.js';
import { io as Client} from 'socket.io-client';


describe('socket.io chat app', () => {
  let client1, client2;

  beforeEach(done => {
    
    client1 = new Client('http://localhost:3000');
    client2 = new Client('http://localhost:3000');

    client1.on('connect', done);
  });

  afterEach(() => {
    client1.close();
    client2.close();
  });

  it('should broadcast new user', done => {
    client2.on('user-connected', username => {
      expect(username).to.equal('User 1');
      done();
    });
    client1.emit('new-user', 'User 1');
  });

  it('should broadcast messages', done => {
    client2.on('chat-message', data => {
      expect(data.message).to.equal('Hello');
      expect(data.name).to.equal(client1.id);
      done();
    });
    client1.emit('send-chat-message', 'Hello');
  });

  it('should broadcast disconnections', done => {
    client2.on('user-disconnected', name => {
      expect(name.id).to.equal(client1.id);
      done();
    });
    client1.disconnect();
  });
});