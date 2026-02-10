import type { ValidationIssue } from '@/errors/ApiError';

/**
 * Supported currency codes
 *
 * ISO 4217 compliant (except for BTC)
 */
export type CurrencyCode = 'USD' | 'EUR' | 'JPY' | 'BRL' | 'BTC';

/**
 * Fixed digit
 *
 * Number represented as a string with a fixed number of decimal digits.
 *
 * @example
 * ```
 * const usd: FixedDigit = "10.90";
 * const btc: FixedDigit = "0.03405000";
 * ```
 */
export type FixedDigit = string;

/**
 * Serializable currency type
 *
 * Money amount is returned as string to avoid loss of
 * precision between de/serialization.
 */
export interface SerializableCurrencyType {
	/**
	 * Currency code
	 */
	code: CurrencyCode;
	/**
	 * Currency amount
	 */
	amount: FixedDigit;
}

export interface ProductResource {
	readonly id: string;
	readonly created: Date;
	readonly name: string;
	readonly prices: ProductPriceResource;
	readonly expiration: Date;
	readonly batch_id: string | null;
}

export type ProductOrderField = 'usd' | 'eur' | 'jpy' | 'brl' | 'btc' | 'exp';

export interface ProductPriceResource {
	/**
	 * US Dollar
	 */
	readonly usd: SerializableCurrencyType;
	/**
	 * Euro
	 */
	readonly eur: SerializableCurrencyType;
	/**
	 * Japanese Yen
	 */
	readonly jpy: SerializableCurrencyType;
	/**
	 * Brazilian Real
	 */
	readonly brl: SerializableCurrencyType;
	/**
	 * Bitcoin
	 */
	readonly btc: SerializableCurrencyType;
}

export interface ProductBatchResource {
	readonly id: string;
	readonly created: Date;
	readonly filename: string;
}

export type ImportProductStrategy = 'partial' | 'atomic';

export interface ImportProductResource {
	readonly batch: ProductBatchResource;
	readonly issues: Array<ValidationIssue>;
	readonly imported: number;
	readonly strategy: ImportProductStrategy;
}

export type ImportStrategy = 'atomic' | 'partial';

export const DEFAULT_IMPORT_STRATEGY: ImportStrategy = 'atomic';

export type RangeValue<T> = [T, T];

export type RangeValueFrom<T> = [T, null];

export type RangeValueTo<T> = [null, T];

export type RangeString = `${string}..${string}`;

export type QueryOrder = 'asc' | 'desc';
