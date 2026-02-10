import { readFileSync } from 'node:fs';
import typescript from '@rollup/plugin-typescript';
import type { RollupOptions } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';

interface PackageJson {
	type: 'module';
	source: string;
	main: string;
	module: string;
	dependencies?: Record<string, string>;
}

interface Tsconfig {
	compilerOptions: {
		target: string;
	};
}

const tsconfigUrl = new URL('tsconfig.json', import.meta.url);

const packageJson = JSON.parse(readFileSync('package.json', { encoding: 'utf8' })) as PackageJson;

const tsconfig = JSON.parse(readFileSync(tsconfigUrl.pathname, { encoding: 'utf8' })) as Tsconfig;

const NODE_MODULE = /^node:/;

function externalModules(): Array<string | RegExp> {
	const external: Array<string | RegExp> = [NODE_MODULE];
	external.push(...Object.keys(packageJson.dependencies ?? {}));
	return external;
}

const options: RollupOptions = {
	input: packageJson.source,
	external: externalModules(),
	plugins: [
		typescript({
			include: ['src/**/*.ts', 'knexfile.ts'],
			tsconfig: tsconfigUrl.pathname,
			incremental: false,
			declaration: false,
			outputToFilesystem: true,
		}),
		esbuild({
			include: /\.ts$/,
			minify: false,
			target: tsconfig.compilerOptions.target,
			jsx: 'transform',
		}),
	],
	output: {
		file: packageJson.main,
		sourcemap: true,
		format: 'es',
	},
};

export default options;
