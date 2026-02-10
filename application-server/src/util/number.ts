export function bigintAbs(num: bigint): bigint {
	return num < 0n ? -num : num;
}
