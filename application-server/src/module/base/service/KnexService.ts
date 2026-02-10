import knex, { type Knex as KnexClient } from 'knex';
import { ConfigService } from '@nestjs/config';
import { Provider, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { EnvVariables, NodeEnv } from '@/config/Environment';
import { knexConfig } from '@project/knexfile';

@Injectable()
export class KnexService implements OnApplicationShutdown {
	public readonly client: KnexClient;

	public constructor(client: KnexClient) {
		this.client = client;
	}

	public async onApplicationShutdown(): Promise<void> {
		await this.client.destroy();
	}
}

function knexServiceFactory(config: ConfigService<EnvVariables, true>): KnexService {
	const cfg = knexConfig(config.get<NodeEnv>('NODE_ENV'), config.get<string>('DATABASE_URL'));
	const client = knex(cfg);
	return new KnexService(client);
}

export const KNEX_SERVICE_PROVIDER = 'SHARED/KNEX_SERVICE_PROVIDER';

export const KnexServiceProvider: Provider<KnexService> = {
	provide: KNEX_SERVICE_PROVIDER,
	useFactory: knexServiceFactory,
	inject: [ConfigService],
};
