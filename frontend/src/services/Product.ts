import type { ResultType } from '@/errors/Result';
import { apiEndpoint } from '@/services/ApiConfig';
import {
	apiFetchUpload,
	appApiFetch,
	parseResponse,
	type FetchOptions,
	type UploadOptions,
	type UploadRequest,
} from '@/services/FetchHelper';
import type { ApiResultError, ApiUnionError } from '@/errors/ApiError';
import type {
	FixedDigit,
	ImportProductResource,
	ImportProductStrategy,
	ProductOrderField,
	ProductResource,
	QueryOrder,
	RangeString,
} from '@/services/Resource';
import { ApiClientError, type ApiClientResult } from '@/errors/ApiClientError';

export type ImportProductResultOk = ResultType<'SUCCESS', ImportProductResource>;

export type ImportProductResult = ImportProductResultOk | ApiResultError | ApiClientResult;

export interface ImportProductInput {
	strategy: ImportProductStrategy;
	file: Blob;
	filename: string;
}

export async function uploadProductCSV(
	input: ImportProductInput,
	options: UploadOptions = {}
): Promise<ImportProductResult> {
	const headers = new Headers();
	headers.set('Accept', 'application/json');

	const formdata = new FormData();
	formdata.set('strategy', input.strategy);
	formdata.set('file', input.file, input.filename);

	const request: UploadRequest = {
		method: 'POST',
		url: apiEndpoint('api/import/product'),
		headers,
		body: formdata,
	};

	const response = await apiFetchUpload(request, options);
	if (response instanceof ApiClientError) {
		return { type: 'API_ERROR', value: response };
	}

	if (![201, 400, 413, 503].includes(response.status)) {
		return {
			type: 'API_ERROR',
			value: ApiClientError.invalidResponse(response.status),
		};
	}

	const data = await parseResponse<ApiUnionError | ImportProductResource>(response);
	if (data instanceof ApiClientError) {
		return { type: 'API_ERROR', value: data };
	}

	switch (response.status) {
		case 201:
			return { type: 'SUCCESS', value: data as ImportProductResource };
		case 400:
		case 413:
		case 503:
			return {
				type: (data as ApiUnionError).error,
				value: data,
			} as ApiResultError;
		default:
			return {
				type: 'API_ERROR',
				value: ApiClientError.invalidResponse(response.status),
			};
	}
}

export type ListProductResultOk = ResultType<'SUCCESS', Array<ProductResource>>;

export type ListProductResult = ListProductResultOk | ApiResultError | ApiClientResult;

export interface ListProductQuery {
	name?: string;
	order?: QueryOrder;
	orderby?: ProductOrderField;
	range?: RangeString;
	rangeby?: 'usd' | 'eur' | 'jpy' | 'brl' | 'btc';
}

export async function listProduct(
	query: ListProductQuery,
	options: FetchOptions = {}
): Promise<ListProductResult> {
	const headers = new Headers();
	headers.set('Accept', 'application/json');

	const url = apiEndpoint('api/product');

	if (query.name) {
		url.searchParams.set('name', query.name);
	}
	if (query.order) {
		url.searchParams.set('ord', query.order);
	}
	if (query.orderby) {
		url.searchParams.set('ordby', query.orderby);
	}
	if (query.range) {
		url.searchParams.set('range', query.range);
	}
	if (query.rangeby) {
		url.searchParams.set('rangeby', query.rangeby);
	}

	const request = new Request(url, {
		method: 'GET',
		headers,
		keepalive: true,
		signal: options.signal,
	});

	const result = await appApiFetch<ApiUnionError | Array<ProductResource>>(
		request,
		[200, 400, 503]
	);
	if (!result.type) {
		return { type: 'API_ERROR', value: result.value };
	}

	const { response, data } = result.value;

	switch (response.status) {
		case 200:
			return { type: 'SUCCESS', value: data as Array<ProductResource> };
		case 400:
		case 503:
			return {
				type: (data as ApiUnionError).error,
				value: data,
			} as ApiResultError;
		default:
			return {
				type: 'API_ERROR',
				value: ApiClientError.invalidResponse(response.status),
			};
	}
}

export interface CreateProductInput {
	name: string;
	price_usd: FixedDigit;
	expiration: Date;
}

export type CreateProductResultOk = ResultType<'SUCCESS', ProductResource>;

export type CreateProductResult = CreateProductResultOk | ApiResultError | ApiClientResult;

export async function createProduct(
	input: CreateProductInput,
	options: FetchOptions = {}
): Promise<CreateProductResult> {
	const headers = new Headers();
	headers.set('Content-Type', 'application/json');
	headers.set('Accept', 'application/json');

	const request = new Request(apiEndpoint('api/product'), {
		method: 'POST',
		body: JSON.stringify(input),
		headers,
		keepalive: true,
		signal: options.signal,
	});

	const result = await appApiFetch<ApiUnionError | ProductResource>(request, [201, 400, 503]);
	if (!result.type) {
		return { type: 'API_ERROR', value: result.value };
	}

	const { response, data } = result.value;

	switch (response.status) {
		case 200:
			return { type: 'SUCCESS', value: data as ProductResource };
		case 400:
		case 503:
			return {
				type: (data as ApiUnionError).error,
				value: data,
			} as ApiResultError;
		default:
			return {
				type: 'API_ERROR',
				value: ApiClientError.invalidResponse(response.status),
			};
	}
}
