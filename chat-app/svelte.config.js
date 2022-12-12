// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

import { Server } from 'socket.io';

export const webSocketServer = {
	name : 'webSocketServer',
	configureServer(server) {
		const io = new Server(server.httpServer);
		io.on('connect', (socket) => {
			socket.emit('eventFromServer', 'Hello from the server');
		})
	}
	// async handle({ request, resolve }) {
	// 	const response = await resolve(request);
	// 	if (response.status === 200 && request.path === '/socket.io') {
	// 		const io = new server(response.body, {
	// 			path : '/socket.io',
	// 			serveClient : false
	// 		});
	// 		io.on('connection', (socket) => {
	// 			console.log('a user connected');
	// 			socket.on('disconnect', () => {
	// 				console.log('user disconnected');
	// 			});
	// 		});
	// 	}
	// 	return response;
	// }
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
	}
};

export default config;
