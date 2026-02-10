import { Knex as KnexClient } from 'knex';
import { Inject, Injectable, Provider } from '@nestjs/common';
import { UlidID, parseOrder } from '@/types/entity';
import { KNEX_SERVICE_PROVIDER, KnexService } from '@/module/base/service/KnexService';
import {
	PRODUCT_REPOSITORY_PROVIDER,
	ProductOrderField,
	ProductQueryParams,
	type ProductRepository,
} from '@/module/product/service/ProductRepository';
import { BRL, BTC, EUR, JPY, PreciseAmount, Product, USD } from '@/module/product/entity/Product';
import { ProductResource } from '@/module/product/dto/Resource';
import { fixedDigitPermissive } from '@/module/product/dto/Mapper';

const PRODUCTS_TABLE = 'products';

type ProductsOrderColumns =
	| 'price_usd'
	| 'price_eur'
	| 'price_jpy'
	| 'price_brl'
	| 'price_btc'
	| 'expiration'
	| 'id';

interface ProductsTable {
	id: string;
	created: Date;
	batch_id: string | null;
	name: string;
	expiration: Date;
	price_usd: PreciseAmount; // CurrencyCompositeType
	price_eur: PreciseAmount; // CurrencyCompositeType
	price_jpy: PreciseAmount; // CurrencyCompositeType
	price_brl: PreciseAmount; // CurrencyCompositeType
	price_btc: PreciseAmount; // CurrencyCompositeType
}

@Injectable()
export class KnexProductRepository implements ProductRepository {
	private readonly client: KnexClient;

	public constructor(
		@Inject(KNEX_SERVICE_PROVIDER)
		service: KnexService
	) {
		this.client = service.client;
	}

	public async find(id: UlidID): Promise<Product | null> {
		const rows = (await this.client
			.select(productsColumn('*'))
			.from<ProductsTable>(PRODUCTS_TABLE)
			.where({ id })) as Array<ProductsTable>;

		const first = rows[0];
		if (!first) {
			return null;
		}

		return mapProductFromTable(first);
	}

	public async query(params: ProductQueryParams): Promise<Array<ProductResource>> {
		const qbuilder = this.client.select(productsColumn('*')).from<ProductsTable>(PRODUCTS_TABLE);
		if (params.range) {
			const col = getColumnBySearchField(params.rangeby);
			const [start, end] = params.range;
			if (start) qbuilder.where(col, '>=', start);
			if (end) qbuilder.where(col, '<', end);
		}
		if (params.name) {
			qbuilder.where('name', '=', params.name);
		}
		const col = params.ordby ? getColumnBySearchField(params.ordby) : 'id';
		qbuilder.orderBy(col, parseOrder(params.ord, 'desc'));

		const rows = await qbuilder;
		return rows.map(mapProductResourceFromTable);
	}
}

function productsColumn(column: string): string {
	return PRODUCTS_TABLE + '.' + column;
}

function getColumnBySearchField(field?: ProductOrderField): ProductsOrderColumns {
	switch (field) {
		case 'usd':
			return 'price_usd';
		case 'eur':
			return 'price_eur';
		case 'jpy':
			return 'price_jpy';
		case 'brl':
			return 'price_brl';
		case 'btc':
			return 'price_btc';
		case 'exp':
			return 'expiration';
		default:
			return 'price_usd';
	}
}

function mapProductFromTable(row: ProductsTable): Product {
	return {
		id: row.id,
		created: row.created,
		batchID: row.batch_id,
		name: row.name,
		expiration: row.expiration,
		prices: {
			usd: { code: 'USD', amount: BigInt(row.price_usd) },
			eur: { code: 'EUR', amount: BigInt(row.price_eur) },
			jpy: { code: 'JPY', amount: BigInt(row.price_jpy) },
			brl: { code: 'BRL', amount: BigInt(row.price_brl) },
			btc: { code: 'BTC', amount: BigInt(row.price_btc) },
		},
	};
}

function mapProductResourceFromTable(row: ProductsTable): ProductResource {
	return {
		id: row.id,
		created: row.created,
		batch_id: row.batch_id,
		name: row.name,
		expiration: row.expiration,
		prices: {
			usd: { code: 'USD', amount: fixedDigitPermissive(BigInt(row.price_usd), USD.unit) },
			eur: { code: 'EUR', amount: fixedDigitPermissive(BigInt(row.price_eur), EUR.unit) },
			jpy: { code: 'JPY', amount: fixedDigitPermissive(BigInt(row.price_jpy), JPY.unit) },
			brl: { code: 'BRL', amount: fixedDigitPermissive(BigInt(row.price_brl), BRL.unit) },
			btc: { code: 'BTC', amount: fixedDigitPermissive(BigInt(row.price_btc), BTC.unit) },
		},
	};
}

export const KnexProductRepositoryProvider: Provider<ProductRepository> = {
	provide: PRODUCT_REPOSITORY_PROVIDER,
	useClass: KnexProductRepository,
};
