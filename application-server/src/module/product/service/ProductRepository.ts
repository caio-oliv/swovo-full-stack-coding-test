import type { UlidID, Order, Range } from '@/types/entity';
import type { PreciseAmount, Product } from '@/module/product/entity/Product';
import type { ProductResource } from '@/module/product/dto/Resource';

export type ProductOrderField = 'usd' | 'eur' | 'jpy' | 'brl' | 'btc' | 'exp';

export interface ProductQueryParams {
	/**
	 * name=<string>
	 */
	name?: string;
	/**
	 * ord=asc|desc
	 */
	ord?: Order;
	/**
	 * ordby=usd|eur|jpy|brl|btc|exp
	 */
	ordby?: ProductOrderField;
	/**
	 * range=<start>..<end>
	 */
	range?: Range<PreciseAmount>;
	/**
	 * rangeby=usd|eur|jpy|brl|btc
	 */
	rangeby?: 'usd' | 'eur' | 'jpy' | 'brl' | 'btc';
}

export interface ProductRepository {
	/**
	 * Finds the product by its ID.
	 *
	 * @param id Product id
	 * @returns Optional product
	 */
	find(id: UlidID): Promise<Product | null>;

	/**
	 * Query a list of products.
	 *
	 * @param params Product query params
	 */
	query(params: ProductQueryParams): Promise<Array<ProductResource>>;
}

export const PRODUCT_REPOSITORY_PROVIDER = 'PRODUCT/PRODUCT_REPOSITORY_PROVIDER';
