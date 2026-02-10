import type { FormHTMLAttributes, JSX } from 'react';
import { SelectInput, type SelectValue } from '@/components/form/SelectInput';
import { Button } from '@/components/form/Button';
import { ErrorList } from '@/components/form/ErrorList';
import {
	mapFilterErrorField,
	useForm,
	type FormError,
	type ValidationResult,
} from '@/hooks/useForm';
import { DEFAULT_IMPORT_STRATEGY, type ImportStrategy } from '@/services/Resource';
import { classes } from '@/styles/helper';
import Style from '@/components/ImportProductForm.module.css';
import { FileInput } from './form/FileInput';

export type BaseProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>;

export interface ImportProductFormData {
	strategy: ImportStrategy;
	file: File;
}

export type SubmitImportDataHandler = (
	value: ImportProductFormData
) => Promise<Array<FormError<ImportProductFormData>> | undefined>;

export interface ImportProductFormProps extends BaseProps {
	onSubmit?: SubmitImportDataHandler;
	disableSubmit?: boolean;
}

const STRATEGY_VALUES: Array<SelectValue> = [
	{ label: 'Atomic', value: 'atomic' },
	{ label: 'Partial', value: 'partial' },
];

async function validation(
	data: ImportProductFormData
): Promise<ValidationResult<ImportProductFormData>> {
	const errors: Array<FormError<ImportProductFormData>> = [];

	if (!data.file) {
		errors.push({ field: 'file', message: 'Missing CSV file' });
	}

	return { errors, data };
}

export function ImportProductForm({
	onSubmit,
	disableSubmit = false,
	className,
	...props
}: ImportProductFormProps): JSX.Element {
	const { handleValue, handleSubmit, data, errors } = useForm<ImportProductFormData>({
		onSubmit,
		initial: { strategy: DEFAULT_IMPORT_STRATEGY },
		validate: validation,
	});

	const formErrors = mapFilterErrorField(errors, '@form-error', 'file');

	return (
		<form onSubmit={handleSubmit} className={classes(Style.container, className)} {...props}>
			<div className={Style.strategy_container}>
				<SelectInput
					name="strategy"
					label="Strategy"
					values={STRATEGY_VALUES}
					value={data.strategy}
					onValueChange={value =>
						handleValue('strategy', (value as ImportStrategy) ?? DEFAULT_IMPORT_STRATEGY)
					}
				/>
				<Button type="submit" className={Style.submit_button} disabled={disableSubmit}>
					Submit
				</Button>
			</div>

			<FileInput
				accept="text/csv"
				file={data.file}
				onFile={file => handleValue('file', file)}
				wrapper={{ className: Style.file_input }}
			/>

			<ErrorList errors={formErrors} className={Style.error_list} />
		</form>
	);
}
