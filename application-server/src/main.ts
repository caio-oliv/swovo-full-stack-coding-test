import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ShutdownSignal } from '@nestjs/common';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import type { EnvVariables } from '@/config/Environment';
import { AppModule } from '@/module/App';
import { fastifyInstance } from '@/FastifyInstance';

async function main(): Promise<void> {
	const app = await makeApp();

	const config = app.get<ConfigService<EnvVariables, true>>(ConfigService);
	const port = config.get<number>('PORT');

	app.setGlobalPrefix('api');

	app.enableShutdownHooks([ShutdownSignal.SIGTERM, ShutdownSignal.SIGINT]);

	await app.listen(port, '0.0.0.0');
}

async function makeApp(): Promise<NestFastifyApplication> {
	const instance = fastifyInstance();
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(instance),
		{ bodyParser: false }
	);
	return app;
}

await main();
