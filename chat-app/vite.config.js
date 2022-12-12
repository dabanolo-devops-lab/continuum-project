import { sveltekit } from '@sveltejs/kit/vite';
import { webSocketServer } from './svelte.config';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), webSocketServer],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
};

export default config;
