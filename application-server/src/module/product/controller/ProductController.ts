import { Controller, Get, HttpCode, HttpStatus, Inject, Param, Query } from '@nestjs/common';
import { SchemaPipe } from '@/pipe/SchemaPipe';
import { PRODUCT_RESOURCE, type ProductResource } from '@/module/product/dto/Resource';
import { mapProductResource } from '@/module/product/dto/Mapper';
import {
	PRODUCT_REPOSITORY_PROVIDER,
	ProductQueryParams,
	type ProductRepository,
} from '@/module/product/service/ProductRepository';
import { UlidID, UlidSchema } from '@/types/entity';
import { ProductQueryParamsSchema } from '../validation/Schema';
import { ResourceError } from '@/exception/ResourceError';

@Controller()
export class ProductController {
	public constructor(
		@Inject(PRODUCT_REPOSITORY_PROVIDER)
		private readonly productRepo: ProductRepository
	) {}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	public async get(@Param('id', new SchemaPipe(UlidSchema)) id: UlidID): Promise<ProductResource> {
		const product = await this.productRepo.find(id);
		if (!product) {
			throw new ResourceError('NOT_FOUND', {
				resource: PRODUCT_RESOURCE,
				key: id,
				path: null,
			});
		}

		return mapProductResource(product);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	public async list(
		@Query(new SchemaPipe(ProductQueryParamsSchema)) params: ProductQueryParams
	): Promise<Array<ProductResource>> {
		return await this.productRepo.query(params);
	}
}
