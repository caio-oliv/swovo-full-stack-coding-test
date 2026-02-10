import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [tailwindcss(), react()],
	resolve: {
		alias: {
			'@': new URL('./src', import.meta.url).pathname,
			'@test': new URL('./src/test', import.meta.url).pathname,
		},
	},
	appType: 'spa',
	server: {
		host: '0.0.0.0',
	},
	preview: {
		allowedHosts: ['frontend_app'],
		host: '0.0.0.0',
		port: 4000,
		open: false,
		strictPort: true,
	},
});
