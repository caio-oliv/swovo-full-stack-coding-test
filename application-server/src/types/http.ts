import type { IncomingHttpHeaders } from 'node:http';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Paramtype } from '@nestjs/common';

export type Request = FastifyRequest; // http.IncomingMessage | http2.Http2ServerRequest
export type Response = FastifyReply; // ServerResponse

export type HeaderKey = keyof IncomingHttpHeaders;
export type HeaderValue = IncomingHttpHeaders[HeaderKey];

export const enum RequestSegment {
	Body = 'BODY',
	Params = 'PARAM',
	Query = 'QUERY',
	Headers = 'HEADER',
	Cookies = 'COOKIE',
	SignedCookies = 'SIGNED_COOKIE',
	MultipartFile = 'MULTIPART_FILE',
	MultipartField = 'MULTIPART_FIELD',
	Unknown = 'UNKNOWN',
}

export function requestSegmentFromParamType(type?: Paramtype | null): RequestSegment {
	switch (type) {
		case 'body':
			return RequestSegment.Body;
		case 'param':
			return RequestSegment.Params;
		case 'query':
			return RequestSegment.Query;
		case 'custom':
		default:
			return RequestSegment.Unknown;
	}
}
