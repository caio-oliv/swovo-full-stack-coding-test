import { Module } from '@nestjs/common';
import { KnexServiceProvider } from '@/module/base/service/KnexService';

@Module({
	providers: [KnexServiceProvider],
	exports: [KnexServiceProvider],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class SharedModule {}
