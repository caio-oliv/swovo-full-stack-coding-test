import { describe, expect, it } from 'vitest';
import { parseRange } from '@/types/entity';

describe('Types.Entity.parseRange', () => {
	it('not parse invalid range', () => {
		const range = parseRange('0..10..90');

		expect(range).toStrictEqual(null);
	});

	it('parse valid range', () => {
		const range = parseRange('10..100');

		expect(range).toStrictEqual(['10', '100']);
	});

	it('parse open start range', () => {
		const range = parseRange('..100');

		expect(range).toStrictEqual([null, '100']);
	});

	it('parse open end range', () => {
		const range = parseRange('1..');

		expect(range).toStrictEqual(['1', null]);
	});

	it('parse range with ISO', () => {
		const start = new Date(2020, 8, 10, 21, 37, 49);
		const end = new Date(2023, 8, 10, 21, 37, 49);
		const range = parseRange(start.toISOString() + '..' + end.toISOString());

		expect(range).toStrictEqual([start.toISOString(), end.toISOString()]);
	});
});
