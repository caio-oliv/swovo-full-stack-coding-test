import { parsePreciseNumber } from '@/module/product/dto/Mapper';
import type { PreciseAmount } from '@/module/product/entity/Product';
import { z, type ZodType } from 'zod';

export type UlidID = string;

const ULID_LENGTH = 26;

const ULID_REGEX = /^[\dABCDEFGHJKMNPQRSTVWXYZ]{26}$/;

export const UlidSchema = z.string().length(ULID_LENGTH).regex(ULID_REGEX);

export type Order = 'asc' | 'desc';

export const OrderSchema = z.enum(['asc', 'desc']);

export function parseOrder(ord?: string, ddefault: Order = 'asc'): Order {
	switch (ord) {
		case 'desc':
			return 'desc';
		case 'asc':
			return 'asc';
		default:
			return ddefault;
	}
}

export type Range<T> = [T | null, T | null];

export const RANGE_SEPARATOR = '..';

export function parseRange(range: string): Range<string> | null {
	const [first, last, rest] = range.split(RANGE_SEPARATOR);
	if (rest) return null;

	return [first ? first : null, last ? last : null];
}

export function preprocessRange(str: unknown): Range<string> | undefined {
	if (typeof str !== 'string') return undefined;
	const range = parseRange(str);
	return range ? range : undefined;
}

export function rangeSchema<T>(schema: ZodType<T>): ZodType<Range<T> | undefined> {
	return z.preprocess(preprocessRange, z.tuple([schema, schema]));
}

export const PreciseAmountSchema = z.string().transform((fixed, ctx): PreciseAmount | undefined => {
	const precise = parsePreciseNumber(fixed);
	if (precise) return precise.amount;
	ctx.addIssue({
		code: 'invalid_format',
		format: '<number>.<number>',
		continue: false,
		message: 'Invalid fixed digit string',
	});
	ctx.aborted = true;
	return undefined;
});

export const AnySchema = z.any().transform(() => undefined);
