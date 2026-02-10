export type ResultType<Descriminant, Type> = {
	type: Descriminant;
	value: Type;
};

export type ValueResult<Ok, Err> = ResultType<true, Ok> | ResultType<false, Err>;
