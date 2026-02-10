import type { ResultType } from './Result';

export type ApiErrorType =
	| 'INVALID_RESPONSE'
	| 'INVALID_RESPONSE_BODY'
	| 'INVALID_FETCH'
	| 'INVALID_UPLOAD'
	| 'ABORTED'
	| 'TIMEOUT'
	| 'NETWORK_ERROR'
	| 'UNKNOWN_ERROR';

/**
 * Regex to match fetch Error messages
 *
 * ## WebKit (Safari)
 *
 * The default error message returned by WebKit in any network request that fails synchronously
 * is assumed to be an access control error. [Source code](https://github.com/WebKit/WebKit/blob/a7a424ab6eb48fee09affb42ac3e1eea7b47b562/Source/WebCore/loader/cache/CachedResourceLoader.cpp#L1211-L1213).
 *
 * Example message: `Fetch API cannot load https://example.com/whatever due to access control checks`.
 *
 * Match regex: `/fetch api/i`.
 *
 * ## Blink (Chrome, Chromium, Microsoft Edge)
 *
 * Example message: `Failed to fetch`.
 *
 * Match regex: `/failed to fetch/i`.
 *
 * ## Gecko (Firefox)
 *
 * Example message: `NetworkError when attempting to fetch resource.`.
 *
 * Match regex: `/network/i`.
 */
const NETWORK_ERROR_MESSAGE_REGEX = /(network|failed to fetch|fetch api)/i;

/**
 * `DOMException` error type with name `'AbortError'`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMException
 */
const ABORT_ERROR_TYPE_NAME = 'AbortError';

/**
 * `DOMException` error type with name `'NetworkError'`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMException
 */
const NETWORK_ERROR_TYPE_NAME = 'NetworkError';

export class ApiClientError extends Error {
	public readonly type: ApiErrorType;
	public readonly status: number | null;

	public constructor(type: ApiErrorType, status: number | null = null, cause: unknown = undefined) {
		super('API Client error: ' + ApiClientError.messageFromType(type), { cause });
		this.type = type;
		this.status = status;
	}

	public static invalidResponse(
		status: number | null = null,
		cause: unknown = undefined
	): ApiClientError {
		return new ApiClientError('INVALID_RESPONSE', status, cause);
	}

	public static invalidBody(
		status: number | null = null,
		cause: unknown = undefined
	): ApiClientError {
		return new ApiClientError('INVALID_RESPONSE_BODY', status, cause);
	}

	public static handleFetchError(err: unknown): ApiClientError {
		if (!(err instanceof Error)) {
			return new ApiClientError('UNKNOWN_ERROR', null, err);
		}

		if (err.name === ABORT_ERROR_TYPE_NAME) {
			return new ApiClientError('ABORTED', null, err);
		}

		if (err.name === NETWORK_ERROR_TYPE_NAME || NETWORK_ERROR_MESSAGE_REGEX.test(err.message)) {
			return new ApiClientError('NETWORK_ERROR', null, err);
		}

		return new ApiClientError('INVALID_FETCH', null, err);
	}

	public static messageFromType(type: ApiErrorType): string {
		switch (type) {
			case 'INVALID_RESPONSE_BODY':
				return 'unexpected response body';
			case 'INVALID_RESPONSE':
				return 'unexpected server response';
			case 'INVALID_FETCH':
				return 'fetch api was called with invalid arguments';
			case 'INVALID_UPLOAD':
				return 'unexpected error during upload';
			case 'ABORTED':
				return 'fetch api call was aborted';
			case 'TIMEOUT':
				return 'fetch api call was aborted due timeout';
			case 'NETWORK_ERROR':
				return 'unexpected network error encountered';
			case 'UNKNOWN_ERROR':
			default:
				return 'unknown error';
		}
	}
}

export type ApiClientResult = ResultType<'API_ERROR', ApiClientError>;
