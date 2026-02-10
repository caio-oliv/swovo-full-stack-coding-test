import { APP_FILTER, RouterModule } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createGlobalConfigOptions } from '@/config/ConfigOptions';
import { HttpExceptionFilter } from '@/exception/HttpExceptionFilter';
import { SharedModule } from '@/module/base/SharedModule';
import { ProductModule } from '@/module/product/ProductModule';

@Module({
	imports: [
		ConfigModule.forRoot(createGlobalConfigOptions()),
		SharedModule,
		ProductModule,
		RouterModule.register([{ path: 'product', module: ProductModule }]),
	],
	providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}
