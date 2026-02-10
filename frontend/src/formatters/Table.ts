export const EMPTY_CELL_VALUE = '';
export const DEFAULT_CELL_VALUE = '-';

export type CellFormatter<Value> = (value?: Value | string) => string;

export function formatCell<Value>(value?: Value | string): string {
	return typeof value !== 'string' ? DEFAULT_CELL_VALUE : value;
}
