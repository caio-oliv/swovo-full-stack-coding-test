const ALL_NUMBER_REGEX = /^-?\d*$/;

export function isAllNumber(str: string): boolean {
	return ALL_NUMBER_REGEX.test(str);
}
