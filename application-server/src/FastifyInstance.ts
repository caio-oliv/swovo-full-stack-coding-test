import fastify, { type FastifyInstance, type FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import type { ContentTypeParserDoneFunction } from 'fastify/types/content-type-parser';
import { isValid as isValidDate, parseISO as parseDateISO8601 } from 'date-fns';
import { ValidationError } from '@/exception/ValidationError';
import { logLevel } from '@/config/ConfigOptions';
import { removeStackTrace } from '@/util/error';
import { RequestSegment } from '@/types/http';

/**
 * Request body size limit (20MB)
 */
const BODY_LIMIT = 20 * 1024 * 1024;

/**
 * Connection timeout in milliseconds (10 seconds)
 */
const CONNECTION_TIMEOUT = 10_000;

/**
 * Keep Alive timeout in milliseconds (1 minute and 30 seconds)
 */
const KEEP_ALIVE_TIMEOUT = 90_000;

export function fastifyInstance(): FastifyInstance {
	const instance = fastify({
		logger: { level: logLevel() },
		bodyLimit: BODY_LIMIT,
		connectionTimeout: CONNECTION_TIMEOUT,
		keepAliveTimeout: KEEP_ALIVE_TIMEOUT,
		routerOptions: {
			caseSensitive: true,
			maxParamLength: 128,
			ignoreTrailingSlash: false,
		},
	});

	instance.removeContentTypeParser('application/json');
	instance.addContentTypeParser('application/json', { parseAs: 'string' }, jsonContentTypeParser);

	instance.register(cors, { origin: true });

	return instance;
}

const INVALID_JSON_ERROR_MESSAGE = 'Invalid JSON received in request body';

function jsonContentTypeParser(
	request: FastifyRequest,
	body: string,
	done: ContentTypeParserDoneFunction
): void {
	try {
		const json: unknown = JSON.parse(body, reviver);
		done(null, json);
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : INVALID_JSON_ERROR_MESSAGE;
		const error = new ValidationError(RequestSegment.Body, [
			{ message, path: null, type: 'invalid_format' },
		]);
		request.log.info(removeStackTrace(error), error.message);
		done(error, undefined);
	}
}

function reviver(_key: string, value: unknown): unknown | Date {
	if (typeof value !== 'string') return value;
	const date = parseDateISO8601(value);
	if (!isValidDate(date)) return value;
	return date;
}
