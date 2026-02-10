import type { ValueResult } from '@/errors/Result';
import { ApiClientError } from '@/errors/ApiClientError';
import { jsonDeserializer } from '@/utils/serde';

export interface FetchOptions {
	signal?: AbortSignal | null;
}

export async function apiFetch(request: Request): Promise<ApiClientError | Response> {
	try {
		return await fetch(request);
	} catch (err: unknown) {
		return ApiClientError.handleFetchError(err);
	}
}

export async function parseResponse<T = unknown>(response: Response): Promise<T> {
	try {
		const str = await response.text();
		return await jsonDeserializer(str);
	} catch (err: unknown) {
		throw ApiClientError.invalidBody(response.status, err);
	}
}

export type FetchResponseType = 'API_ERROR';

export interface DeserializedResponse<T> {
	readonly response: Response;
	readonly data: T;
}

export async function appApiFetch<T>(
	request: Request,
	knownResponseStatus: Array<number>
): Promise<ValueResult<DeserializedResponse<T>, ApiClientError>> {
	const response = await apiFetch(request);
	if (response instanceof ApiClientError) {
		return { type: false, value: response };
	}

	if (knownResponseStatus.includes(response.status)) {
		const data = await parseResponse<T>(response);
		if (data instanceof ApiClientError) {
			return { type: false, value: data };
		}
		return { type: true, value: { data, response } };
	}

	return { type: false, value: ApiClientError.invalidResponse(response.status) };
}

export const DEFAULT_UPLOAD_TIMEOUT = 10_000;

export type UploadProgressHandler = (event: ProgressEvent) => void;

export interface UploadRequest {
	url: string | URL;
	method: 'POST' | 'PUT' | 'PATCH';
	body: FormData | Blob | BufferSource;
	headers?: Headers;
}

export interface UploadOptions {
	progress?: UploadProgressHandler | null;
	signal?: AbortSignal | null;
	/**
	 * Number of milliseconds a request can take before automatically being terminated.
	 */
	timeout?: number;
}

export function fetchUpload(
	request: UploadRequest,
	options: UploadOptions = {}
): Promise<Response> {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.upload.addEventListener('progress', e => options.progress?.(e));
		xhr.addEventListener('error', () => reject(new ApiClientError('INVALID_UPLOAD')));
		xhr.addEventListener('abort', () => reject(new ApiClientError('ABORTED')));
		xhr.addEventListener('timeout', () => reject(new ApiClientError('TIMEOUT')));
		xhr.addEventListener('load', () => {
			const response = new Response(xhr.response as ArrayBuffer, {
				// url: xhr.responseURL, // Not supported
				headers: parseResponseHeaders(xhr),
				status: xhr.status,
				statusText: xhr.statusText,
			});
			resolve(response);
		});

		xhr.responseType = 'arraybuffer';
		xhr.timeout = options.timeout ?? DEFAULT_UPLOAD_TIMEOUT;
		options.signal?.addEventListener('abort', () => {
			if (xhr.readyState !== xhr.DONE) {
				xhr.abort();
			}
		});

		xhr.open(request.method, request.url, true);
		request.headers?.forEach((value, name) => {
			xhr.setRequestHeader(name, value);
		});

		xhr.send(request.body);
	});
}

export async function apiFetchUpload(
	request: UploadRequest,
	options: UploadOptions = {}
): Promise<ApiClientError | Response> {
	try {
		return await fetchUpload(request, options);
	} catch (err: unknown) {
		if (err instanceof ApiClientError) {
			return err;
		}
		return ApiClientError.handleFetchError(err);
	}
}

const HEADER_PAIR_SEPARATOR = /[\r\n]+/;

function parseResponseHeaders(xhr: XMLHttpRequest): Headers {
	const headersTxt = xhr.getAllResponseHeaders();
	const pairs = headersTxt.trim().split(HEADER_PAIR_SEPARATOR);

	const headers = new Headers();
	for (const pair of pairs) {
		const [name, value = ''] = pair.split(': ', 2);
		if (name) headers.append(name, value);
	}

	return headers;
}
