import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['src/**/*.test.ts'],
		globals: false,
		environment: 'node',
		alias: {
			'@': new URL('./src', import.meta.url).pathname,
			'@test': new URL('./test', import.meta.url).pathname,
			'@project': new URL('./test', import.meta.url).pathname,
		},
		coverage: {
			include: ['src/**/*.[jt]s'],
			exclude: ['src/**/*.mock.*', 'src/**/*.test.*'],
			provider: 'v8',
			reportsDirectory: 'coverage',
			reporter: ['text', 'html', 'lcov'],
			clean: true,
		},
	},
});
