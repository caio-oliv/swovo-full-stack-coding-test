export type NodeEnv = 'development' | 'test' | 'production';

export interface EnvVariables {
	/**
	 * Current NodeJS runtime enviornment
	 */
	NODE_ENV: NodeEnv;
	/**
	 * Service port listening the incoming connections.
	 */
	PORT: number;
	/**
	 * Database connection string
	 */
	DATABASE_URL: string;
}
