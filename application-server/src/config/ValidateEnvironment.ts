import z from 'zod';
import type { EnvVariables } from '@/config/Environment';

const NodeEnvironmentSchema = z.enum(['development', 'test', 'production']).default('development');

const ServerPortSchema = z.coerce.number().int({ message: 'PORT environment must be a integer' });

const DatabaseUrlSchema = z.url({ protocol: /^postgres(ql)?$/ });

const EnvVariablesSchema = z.object({
	PORT: ServerPortSchema,
	NODE_ENV: NodeEnvironmentSchema,
	DATABASE_URL: DatabaseUrlSchema,
});

export function validateEnvVariables(env: Record<string, unknown>): EnvVariables {
	return EnvVariablesSchema.parse(env);
}
