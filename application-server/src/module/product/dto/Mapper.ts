import { DomainError } from '@/exception/DomainError';
import type {
	FixedDigit,
	ProductPriceResource,
	ProductResource,
	SerializableCurrencyType,
} from '@/module/product/dto/Resource';
import {
	getCurrencyDescriptor,
	type ProductPrice,
	type CurrencyType,
	type Product,
	type PreciseNumber,
	type PreciseAmount,
} from '@/module/product/entity/Product';
import { bigintAbs } from '@/util/number';
import { isAllNumber } from '@/util/string';

export function fixedDigit(amount: PreciseAmount, digits: number): FixedDigit | null {
	if (digits < 0 || !Number.isInteger(digits)) {
		return null;
	}

	if (digits === 0) {
		return amount.toString();
	}

	const isNegative = amount < 0n;
	const amountstr = bigintAbs(amount).toString();

	const integral = amountstr.slice(0, Math.max(amountstr.length - digits, 0));
	const fraction = amountstr.slice(-digits);
	const fractionFull = fraction.padStart(digits, '0');
	const integralFull = integral.padStart(1, '0');
	const fixedAbsolute = integralFull + '.' + fractionFull;
	return isNegative ? '-' + fixedAbsolute : fixedAbsolute;
}

export function fixedDigitPermissive(amount: PreciseAmount, digits: number): FixedDigit {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return fixedDigit(amount, Math.trunc(Math.max(digits, 0)))!;
}

export function mapFixedDigit(amount: PreciseAmount, digits: number): FixedDigit {
	const fixed = fixedDigit(amount, digits);
	if (!fixed) {
		throw new DomainError({
			entity: 'FIXED_DIGIT',
			id: null,
			message: 'expected the number of digits as a positive integer',
			operation: 'fixed_digit_from_invalid_precise_number',
		});
	}

	return fixed;
}

export function parsePreciseNumber(fixed: FixedDigit): PreciseNumber | null {
	const [integral, fraction = '', ...rest] = fixed.split('.');
	if (!integral || rest.length !== 0) {
		return null;
	}

	const full = integral + fraction;
	if (!isAllNumber(full)) {
		return null;
	}

	return { amount: BigInt(full), unit: fraction.length };
}

export function mapPreciseNumber(fixed: FixedDigit): PreciseNumber {
	const precise = parsePreciseNumber(fixed);
	if (!precise) {
		throw new DomainError({
			entity: 'PRECISE_NUMBER',
			id: null,
			message: 'expected valid fixed digit',
			operation: 'precise_number_from_invalid_fixed_digit',
		});
	}

	return precise;
}

export function mapSerializableCurrency(currency: CurrencyType): SerializableCurrencyType {
	const descriptor = getCurrencyDescriptor(currency.code);
	return {
		code: currency.code,
		amount: mapFixedDigit(currency.amount, descriptor.unit),
	};
}

export function mapProductPriceResource(prices: ProductPrice): ProductPriceResource {
	return {
		usd: mapSerializableCurrency(prices.usd),
		eur: mapSerializableCurrency(prices.eur),
		jpy: mapSerializableCurrency(prices.jpy),
		brl: mapSerializableCurrency(prices.brl),
		btc: mapSerializableCurrency(prices.btc),
	};
}

export function mapProductResource(product: Product): ProductResource {
	return {
		id: product.id,
		created: product.created,
		batch_id: product.batchID,
		name: product.name,
		expiration: product.expiration,
		prices: mapProductPriceResource(product.prices),
	};
}
