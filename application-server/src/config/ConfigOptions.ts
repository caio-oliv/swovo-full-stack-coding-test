import { env } from 'node:process';
import type { ConfigModuleOptions } from '@nestjs/config';
import type { NodeEnv } from '@/config/Environment';
import type { LogLevel } from '@nestjs/common';
import { validateEnvVariables } from '@/config/ValidateEnvironment';

export function createGlobalConfigOptions(): ConfigModuleOptions {
	const options: ConfigModuleOptions = {
		isGlobal: true,
		cache: true,
		expandVariables: true,
		validate: validateEnvVariables,
	};

	switch (env['NODE_ENV'] as NodeEnv) {
		case 'production':
			options.ignoreEnvFile = true;
			break;

		case 'test':
			options.ignoreEnvFile = false;
			options.envFilePath = '.test.env';
			break;

		case 'development':
		default:
			options.ignoreEnvFile = false;
			options.envFilePath = '.dev.env';
	}

	return options;
}

export function logLevel(): LogLevel {
	switch (env['NODE_ENV'] as NodeEnv) {
		case 'production':
			return 'log';

		case 'test':
		case 'development':
		default:
			return 'debug';
	}
}
