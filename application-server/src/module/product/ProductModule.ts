import { Module } from '@nestjs/common';
import { SharedModule } from '@/module/base/SharedModule';
import { ProductController } from '@/module/product/controller/ProductController';
import { KnexProductRepositoryProvider } from '@/module/product/service/impls/KnexProductRepository';

@Module({
	imports: [SharedModule],
	providers: [KnexProductRepositoryProvider],
	controllers: [ProductController],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ProductModule {}
