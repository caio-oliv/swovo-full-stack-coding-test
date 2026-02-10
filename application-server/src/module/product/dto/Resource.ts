import type { CurrencyCode, ImportStrategy } from '@/module/product/entity/Product';

export const PRODUCT_RESOURCE = 'product';

export interface ProductResource {
	readonly id: string;
	readonly created: Date;
	readonly name: string;
	readonly prices: ProductPriceResource;
	readonly expiration: Date;
	readonly batch_id: string | null;
}

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

/**
 * Product price resource
 *
 * Price information is returned as string to avoid loss of
 * precision between de/serialization.
 */
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
	readonly strategy: ImportStrategy;
	readonly filename: string;
}
