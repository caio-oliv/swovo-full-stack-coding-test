import type { ResultType } from '@/errors/Result';

export type ApiErrorType =
	| 'VALIDATION'
	| 'NOT_FOUND'
	| 'CONFLICT'
	| 'ALREADY_EXISTS'
	| 'DOMAIN'
	| 'UNAVAILABLE'
	| 'NOT_IMPLEMENTED'
	| 'INTERNAL_ERROR'
	| 'PAYLOAD_TOO_LARGE';

export interface ApiError {
	readonly status: number;
	readonly message: string;
	readonly error: ApiErrorType;
}

export interface ResourceLocation {
	readonly resource: string;
	readonly key: string;
	readonly path: string | null;
}

export interface ApiNotFoundError extends ApiError {
	readonly status: 404;
	readonly error: 'NOT_FOUND';
	readonly resource: ResourceLocation;
}

export interface ApiConflictError extends ApiError {
	readonly status: 409;
	readonly error: 'CONFLICT';
	readonly resource: ResourceLocation;
}

export interface ApiAlreadyExistsError extends ApiError {
	readonly status: 409;
	readonly error: 'ALREADY_EXISTS';
	readonly resource: ResourceLocation;
}

export type ApiResourceError = ApiNotFoundError | ApiConflictError | ApiAlreadyExistsError;

export type RequestSegment =
	| 'BODY'
	| 'PARAM'
	| 'QUERY'
	| 'HEADER'
	| 'COOKIE'
	| 'SIGNED_COOKIE'
	| 'MULTIPART_FILE'
	| 'MULTIPART_FIELD'
	| 'UNKNOWN';

export interface ValidationIssue {
	readonly message: string;
	readonly path: string | null;
	readonly type: string;
}

export interface ApiValidationError extends ApiError {
	readonly status: 400;
	readonly error: 'VALIDATION';
	readonly segment: RequestSegment;
	readonly issues: Array<ValidationIssue>;
}

export interface ApiPayloadError extends ApiError {
	readonly status: 413;
	readonly error: 'PAYLOAD_TOO_LARGE';
}

export type DoaminEntity = 'PRODUCT' | 'PRODUCT_BATCH' | 'FIXED_DIGIT' | 'PRECISE_NUMBER';

export interface DomainErrorDescription {
	readonly entity: DoaminEntity;
	readonly operation: string;
	readonly message: string;
	readonly id: string | null;
}

export interface ApiDomainError extends ApiError {
	readonly status: 422;
	readonly error: 'DOMAIN';
	readonly domain: DomainErrorDescription;
}

export interface ApiUnavailableError extends ApiError {
	readonly status: 503;
	readonly error: 'UNAVAILABLE';
}

export interface ApiNotImplementedError extends ApiError {
	readonly status: 501;
	readonly error: 'NOT_IMPLEMENTED';
}

export interface ApiInternalError extends ApiError {
	readonly status: 500;
	readonly error: 'INTERNAL_ERROR';
}

export type ApiServiceError = ApiUnavailableError | ApiNotImplementedError | ApiInternalError;

export type ApiUnionError =
	| ApiNotFoundError
	| ApiConflictError
	| ApiAlreadyExistsError
	| ApiValidationError
	| ApiPayloadError
	| ApiDomainError
	| ApiUnavailableError
	| ApiNotImplementedError
	| ApiInternalError;

export type ApiResultError =
	| ResultType<'NOT_FOUND', ApiNotFoundError>
	| ResultType<'CONFLICT', ApiConflictError>
	| ResultType<'ALREADY_EXISTS', ApiAlreadyExistsError>
	| ResultType<'VALIDATION', ApiValidationError>
	| ResultType<'PAYLOAD_TOO_LARGE', ApiPayloadError>
	| ResultType<'DOMAIN', ApiDomainError>
	| ResultType<'UNAVAILABLE', ApiUnavailableError>
	| ResultType<'NOT_IMPLEMENTED', ApiNotImplementedError>
	| ResultType<'INTERNAL_ERROR', ApiInternalError>;
