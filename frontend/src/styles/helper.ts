type ClassName = string | null | undefined;

export function classes(...classNames: Array<ClassName>): string {
	return classNames.filter(className => Boolean(className)).join(' ');
}
