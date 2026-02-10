import { describe, expect, it } from 'vitest';
import { objectPath } from '@/util/object';

describe('objectPath', () => {
	it('return a root obejct path', () => {
		const path = objectPath([]);

		expect(path).toStrictEqual('$');
	});
});
