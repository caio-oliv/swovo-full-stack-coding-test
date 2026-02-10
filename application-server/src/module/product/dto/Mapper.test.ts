import { describe, expect, it } from 'vitest';
import { mapFixedDigit, mapPreciseNumber } from '@/module/product/dto/Mapper';
import { DomainError } from '@/exception/DomainError';

describe('Product.Mapper.mapFixedDigit', () => {
	it('throw error when digit is negative', () => {
		expect(() => mapFixedDigit(987654321n, -1)).toThrowError(
			new DomainError({
				entity: 'FIXED_DIGIT',
				id: null,
				message: 'expected the number of digits as a positive integer',
				operation: 'fixed_digit_from_invalid_precise_number',
			})
		);
	});

	it('throw error when digit is not an integral', () => {
		expect(() => mapFixedDigit(-987654321n, 3.14)).toThrowError(
			new DomainError({
				entity: 'FIXED_DIGIT',
				id: null,
				message: 'expected the number of digits as a positive integer',
				operation: 'fixed_digit_from_invalid_precise_number',
			})
		);
	});

	it('format fixed digit preserving precision', () => {
		const big = 923412810198765432891084235201273938423711n;

		{
			const fixed = mapFixedDigit(big, 18);
			expect(fixed).toStrictEqual('923412810198765432891084.235201273938423711');
		}
		{
			const fixed = mapFixedDigit(-big, 18);
			expect(fixed).toStrictEqual('-923412810198765432891084.235201273938423711');
		}
	});

	it('format fixed digit with no decimal part', () => {
		const big = 18231042834237489237953475284912038491n;
		{
			const fixed = mapFixedDigit(big, 0);
			expect(fixed).toStrictEqual('18231042834237489237953475284912038491');
		}

		{
			const fixed = mapFixedDigit(-big, 0);
			expect(fixed).toStrictEqual('-18231042834237489237953475284912038491');
		}
	});

	it('format fixed digit with decimal digits', () => {
		const big = 92013492342190342735273904820000n;
		{
			// 1 digit
			const fixed = mapFixedDigit(big, 1);
			expect(fixed).toStrictEqual('9201349234219034273527390482000.0');
		}
		{
			// 2 digits
			const fixed = mapFixedDigit(big, 2);
			expect(fixed).toStrictEqual('920134923421903427352739048200.00');
		}
		{
			// 3 digits
			const fixed = mapFixedDigit(big, 3);
			expect(fixed).toStrictEqual('92013492342190342735273904820.000');
		}

		{
			// 1 digit
			const fixed = mapFixedDigit(-big, 1);
			expect(fixed).toStrictEqual('-9201349234219034273527390482000.0');
		}
		{
			// 2 digits
			const fixed = mapFixedDigit(-big, 2);
			expect(fixed).toStrictEqual('-920134923421903427352739048200.00');
		}
		{
			// 3 digits
			const fixed = mapFixedDigit(-big, 3);
			expect(fixed).toStrictEqual('-92013492342190342735273904820.000');
		}
	});

	it('format fixed digit with amount having a digit count equal the decimal part', () => {
		{
			const num = 34723891n;

			const fixed = mapFixedDigit(num, 8);
			expect(fixed).toStrictEqual('0.34723891');
		}
		{
			const num = -34723891n;

			const fixed = mapFixedDigit(num, 8);
			expect(fixed).toStrictEqual('-0.34723891');
		}
		{
			const num = 19n;

			const fixed = mapFixedDigit(num, 2);
			expect(fixed).toStrictEqual('0.19');
		}
		{
			const num = -19n;

			const fixed = mapFixedDigit(num, 2);
			expect(fixed).toStrictEqual('-0.19');
		}
	});

	it('format fixed digit with amount having a digit count smaller than decimal part', () => {
		{
			const num = 7238n;

			const fixed = mapFixedDigit(num, 8);
			expect(fixed).toStrictEqual('0.00007238');
		}
		{
			const num = -7238n;

			const fixed = mapFixedDigit(num, 8);
			expect(fixed).toStrictEqual('-0.00007238');
		}
		{
			const num = 1n;

			const fixed = mapFixedDigit(num, 2);
			expect(fixed).toStrictEqual('0.01');
		}
		{
			const num = -1n;

			const fixed = mapFixedDigit(num, 2);
			expect(fixed).toStrictEqual('-0.01');
		}
	});

	it('format zero fixed digit', () => {
		{
			const fixed = mapFixedDigit(0n, 8);
			expect(fixed).toStrictEqual('0.00000000');
		}
		{
			const fixed = mapFixedDigit(0n, 0);
			expect(fixed).toStrictEqual('0');
		}
		{
			const fixed = mapFixedDigit(0n, 2);
			expect(fixed).toStrictEqual('0.00');
		}
	});
});

describe('Product.Mapper.mapPreciseNumber', () => {
	it('throw error when fixed digit is empty', () => {
		expect(() => mapPreciseNumber('')).toThrowError(
			new DomainError({
				entity: 'PRECISE_NUMBER',
				id: null,
				message: 'expected valid fixed digit',
				operation: 'precise_number_from_invalid_fixed_digit',
			})
		);
	});

	it('throw error when fixed digit has more than one point', () => {
		expect(() => mapPreciseNumber('9123.131.0')).toThrowError(
			new DomainError({
				entity: 'PRECISE_NUMBER',
				id: null,
				message: 'expected valid fixed digit',
				operation: 'precise_number_from_invalid_fixed_digit',
			})
		);
	});

	it('parse precise number preserving precision', () => {
		const fixed = '8937123901423754893412903845.789345929831';

		{
			const precise = mapPreciseNumber(fixed);
			expect(precise).toStrictEqual({
				amount: 8937123901423754893412903845789345929831n,
				unit: 12,
			});
		}
		{
			const precise = mapPreciseNumber('-' + fixed);
			expect(precise).toStrictEqual({
				amount: -8937123901423754893412903845789345929831n,
				unit: 12,
			});
		}
	});

	it('parse precise number with no decimal part', () => {
		const fixed = '82930472398203478923412989572100';

		{
			const precise = mapPreciseNumber(fixed);
			expect(precise).toStrictEqual({
				amount: 82930472398203478923412989572100n,
				unit: 0,
			});
		}
		{
			const precise = mapPreciseNumber('-' + fixed);
			expect(precise).toStrictEqual({
				amount: -82930472398203478923412989572100n,
				unit: 0,
			});
		}
	});

	it('parse precise number with decimal digits', () => {
		{
			// 1 digit
			const fixed = '123971234923849023810.0';
			const precise = mapPreciseNumber(fixed);
			expect(precise).toStrictEqual({
				amount: 1239712349238490238100n,
				unit: 1,
			});
		}
		{
			// 2 digit
			const fixed = '12932034702311.78';
			const precise = mapPreciseNumber(fixed);
			expect(precise).toStrictEqual({
				amount: 1293203470231178n,
				unit: 2,
			});
		}
		{
			// 3 digit
			const fixed = '923712329364592.384';
			const precise = mapPreciseNumber(fixed);
			expect(precise).toStrictEqual({
				amount: 923712329364592384n,
				unit: 3,
			});
		}

		{
			// 1 digit
			const fixed = '-29340239470921.8';
			const precise = mapPreciseNumber(fixed);
			expect(precise).toStrictEqual({
				amount: -293402394709218n,
				unit: 1,
			});
		}
		{
			// 2 digit
			const fixed = '-3941237.98';
			const precise = mapPreciseNumber(fixed);
			expect(precise).toStrictEqual({
				amount: -394123798n,
				unit: 2,
			});
		}
		{
			// 3 digit
			const fixed = '-2389432485128127423891924.358';
			const precise = mapPreciseNumber(fixed);
			expect(precise).toStrictEqual({
				amount: -2389432485128127423891924358n,
				unit: 3,
			});
		}
	});

	it('parse precise number with amount having a digit count equal the decimal part', () => {
		{
			const fixed = '0.91023371';
			const precise = mapPreciseNumber(fixed);
			expect(precise).toStrictEqual({ amount: 91023371n, unit: 8 });
		}
		{
			const fixed = '-0.91023371';
			const precise = mapPreciseNumber(fixed);
			expect(precise).toStrictEqual({ amount: -91023371n, unit: 8 });
		}

		{
			const fixed = '0.91';
			const precise = mapPreciseNumber(fixed);
			expect(precise).toStrictEqual({ amount: 91n, unit: 2 });
		}
		{
			const fixed = '-0.91';
			const precise = mapPreciseNumber(fixed);
			expect(precise).toStrictEqual({ amount: -91n, unit: 2 });
		}
	});

	it('parse precise number with amount having a digit count smaller than decimal part', () => {
		{
			const fixed = '0.00000912';
			const precise = mapPreciseNumber(fixed);
			expect(precise).toStrictEqual({ amount: 912n, unit: 8 });
		}
		{
			const fixed = '-0.00000912';
			const precise = mapPreciseNumber(fixed);
			expect(precise).toStrictEqual({ amount: -912n, unit: 8 });
		}

		{
			const fixed = '0.09';
			const precise = mapPreciseNumber(fixed);
			expect(precise).toStrictEqual({ amount: 9n, unit: 2 });
		}
		{
			const fixed = '-0.09';
			const precise = mapPreciseNumber(fixed);
			expect(precise).toStrictEqual({ amount: -9n, unit: 2 });
		}
	});

	it('parse precise number with zero fixed digit', () => {
		{
			const fixed = '0.00000000';
			const precise = mapPreciseNumber(fixed);
			expect(precise).toStrictEqual({ amount: 0n, unit: 8 });
		}
		{
			const fixed = '0';
			const precise = mapPreciseNumber(fixed);
			expect(precise).toStrictEqual({ amount: 0n, unit: 0 });
		}
		{
			const fixed = '0.00';
			const precise = mapPreciseNumber(fixed);
			expect(precise).toStrictEqual({ amount: 0n, unit: 2 });
		}
	});
});
