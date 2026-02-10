import type { UlidID } from '@/types/entity';

export type ImportStrategy = 'atomic' | 'partial';

export interface ProductBatch {
	readonly id: UlidID;
	readonly created: Date;
	readonly strategy: ImportStrategy;
	readonly filename: string;
}

export interface Product {
	readonly id: UlidID;
	readonly created: Date;
	readonly batchID: UlidID | null;
	readonly name: string;
	readonly prices: ProductPrice;
	readonly expiration: Date;
}

export interface ProductPrice {
	/**
	 * US Dollar
	 */
	readonly usd: CurrencyType;
	/**
	 * Euro
	 */
	readonly eur: CurrencyType;
	/**
	 * Japanese Yen
	 */
	readonly jpy: CurrencyType;
	/**
	 * Brazilian Real
	 */
	readonly brl: CurrencyType;
	/**
	 * Bitcoin
	 */
	readonly btc: CurrencyType;
}

/**
 * Supported currency codes
 *
 * ISO 4217 compliant (except for BTC)
 */
export type CurrencyCode = 'USD' | 'EUR' | 'JPY' | 'BRL' | 'BTC';

/**
 * Precise amount
 *
 * Number represented as a `bitint` as the smallest currency amount.
 *
 * @example
 * ```
 * const usd: CurrencyAmount = 1090n // equivalent of $10.90
 * const btc: CurrencyAmount = 23405000n // equivalent of 0.23405000 BTC
 * ```
 */
export type PreciseAmount = bigint;

/**
 * Unit
 *
 * Number of decimals used to represent the smalles amount.
 */
export type Unit = number;

export interface PreciseNumber {
	amount: PreciseAmount;
	unit: Unit;
}

export interface CurrencyType {
	/**
	 * Currency code
	 */
	readonly code: CurrencyCode;
	/**
	 * Currency amount
	 */
	readonly amount: PreciseAmount;
}

export interface CurrencyDescriptor {
	/**
	 * Currency code
	 */
	readonly code: CurrencyCode;
	/**
	 * Unit
	 */
	readonly unit: Unit;
	/**
	 * Human-Readable currency name
	 */
	readonly description: string;
}

export const USD: CurrencyDescriptor = {
	code: 'USD',
	unit: 2,
	description: 'US Dollar',
};

export const EUR: CurrencyDescriptor = {
	code: 'EUR',
	unit: 2,
	description: 'Euro',
};

export const JPY: CurrencyDescriptor = {
	code: 'JPY',
	unit: 0,
	description: 'Japanese Yen',
};

export const BRL: CurrencyDescriptor = {
	code: 'BRL',
	unit: 2,
	description: 'Brazilian Real',
};

export const BTC: CurrencyDescriptor = {
	code: 'BTC',
	unit: 8,
	description: 'Bitcoin',
};

export function getCurrencyDescriptor(code: CurrencyCode): CurrencyDescriptor {
	switch (code) {
		case 'USD':
			return USD;
		case 'EUR':
			return EUR;
		case 'JPY':
			return JPY;
		case 'BRL':
			return BRL;
		case 'BTC':
			return BTC;
	}
}

export const CURRENCIES = [USD, EUR, JPY, BRL, BTC];
