import { useState, type ChangeEvent, type SubmitEvent } from 'react';

export const FORM_ERROR_FIELD = '@form-error';

export type FormErrorField<T> = keyof T | typeof FORM_ERROR_FIELD;

export interface FormError<T> {
	field: FormErrorField<T>;
	message: string;
}

export interface ValidationResult<T> {
	errors: Array<FormError<T>>;
	data: T;
}

export type OnSubmit<T> = (data: T) => Promise<Array<FormError<T>> | null | undefined>;
export type OnChange<T> = (data: T, errors: Array<FormError<T>>) => void;
export type ValidateFn<T> = (data: T) => Promise<ValidationResult<T>>;

export interface UseFormInput<T extends object> {
	initial?: Partial<T>;
	onSubmit?: OnSubmit<T>;
	onChange?: OnChange<T>;
	validate?: ValidateFn<T>;
}

export interface UseFormReturn<T extends object> {
	data: T;
	errors: Array<FormError<T>>;
	handleChange(event: ChangeEvent<HTMLInputElement>): Promise<void>;
	handleValue(name: keyof T, value: T[keyof T]): Promise<void>;
	updateValue(upadate: (data: T) => T): Promise<void>;
	handleSubmit(event: SubmitEvent<HTMLFormElement>): Promise<void>;
	reset(): void;
}

export function useForm<T extends object>({
	initial,
	onSubmit,
	onChange,
	validate,
}: UseFormInput<T>): UseFormReturn<T> {
	const [data, setData] = useState<T>((initial as T) ?? ({} as T));
	const [errors, setErrors] = useState<Array<FormError<T>>>([]);

	async function setInnerState(newData: T): Promise<void> {
		const { errors, data: returned } = (await validate?.(newData)) ?? { errors: [], data: newData };

		onChange?.(returned, errors);

		setErrors(errors);
		setData(returned);
	}

	async function updateValue(upadate: (data: T) => T): Promise<void> {
		const newData = upadate(data);
		setInnerState(newData);
	}

	async function handleValue(name: keyof T, value: T[keyof T]): Promise<void> {
		const newData = { ...data, [name]: value };
		setInnerState(newData);
	}

	async function handleChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
		const { name, value } = event.target;
		await handleValue(name as keyof T, value as T[keyof T]);
	}

	async function handleSubmit(event: SubmitEvent<HTMLFormElement>): Promise<void> {
		event.preventDefault();

		const { errors, data: returned } = (await validate?.(data)) ?? { errors: [], data };
		if (errors.length !== 0) {
			setErrors(errors);
			setData(returned);
			return;
		}

		const err = (await onSubmit?.(data)) ?? [];
		setErrors(err);
		setData(returned);
	}

	function reset(): void {
		setData((initial as T) ?? ({} as T));
		setErrors([]);
	}

	return { data, errors, handleValue, updateValue, handleChange, handleSubmit, reset };
}

export function mapFilterErrorField<T>(
	errors: Array<FormError<T>>,
	...fields: Array<FormErrorField<T>>
): Array<string> {
	return errors.filter(err => fields.includes(err.field)).map(err => err.message);
}
