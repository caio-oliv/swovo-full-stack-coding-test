export type ObjectSegment = string | number | symbol;

export function objectPath(items: Array<ObjectSegment> | null): string | null {
	if (!items) return null;

	let path = '$';
	for (const item of items) {
		if (typeof item === 'number') path += '[' + item + ']';
		else path += '.' + item.toString();
	}
	return path;
}
