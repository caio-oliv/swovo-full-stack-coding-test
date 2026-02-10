import { env } from 'node:process';
import type { Knex } from 'knex';
import type { EnvVariables, NodeEnv } from '@/config/Environment';

export function knexConfig(env: NodeEnv, databaseUrl: string): Knex.Config {
	const config = {
		client: 'pg',
		connection: {
			connectionString: databaseUrl,
			ssl: env === 'production' ? { rejectUnauthorized: false } : false,
		},
		debug: env === 'development',
		pool: {
			min: 1,
			max: 8,
		},
		migrations: {
			tableName: 'knex_migration',
			directory: './migrations',
			extension: 'ts',
		},
		seeds: {
			directory: './seeds',
			extension: 'ts',
		},
	};

	return config;
}

/**
 * Consumed by the knex CLI
 */
export default knexConfig(
	(env as unknown as EnvVariables).NODE_ENV,
	(env as unknown as EnvVariables).DATABASE_URL
);
