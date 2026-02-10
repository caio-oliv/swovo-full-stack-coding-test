export function removeStackTrace<T extends Error>(err: T, clone: boolean = true): Omit<T, 'stack'> {
	if (!clone) {
		delete err.stack;
		return err;
	}

	const clonedErr = structuredClone(err);
	delete clonedErr.stack;
	return clonedErr;
}
