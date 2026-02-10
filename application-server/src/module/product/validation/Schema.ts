import z from 'zod';
import { AnySchema, PreciseAmountSchema, OrderSchema, rangeSchema } from '@/types/entity';

export const ProductOrderFieldSchema = z.enum(['usd', 'eur', 'jpy', 'brl', 'btc', 'exp']);

export const ProductRangeFieldSchema = z.enum(['usd', 'eur', 'jpy', 'brl', 'btc']);

export const ProductQueryParamsSchema = z.looseObject({
	name: z.union([z.string().max(16), AnySchema]),
	ord: z.union([OrderSchema, AnySchema]),
	ordby: z.union([ProductOrderFieldSchema, AnySchema]),
	range: z.union([rangeSchema(PreciseAmountSchema), AnySchema]),
	rangeby: z.union([ProductRangeFieldSchema, AnySchema]),
});
