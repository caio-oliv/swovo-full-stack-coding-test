import { type FormHTMLAttributes, type JSX } from 'react';
import type { ListProductQuery } from '@/services/Product';
import type { ProductOrderField, QueryOrder, RangeString, RangeValue } from '@/services/Resource';
import { TextField } from '@/components/form/TextField';
import { SelectInput, type SelectValue } from '@/components/form/SelectInput';
import { mapFilterErrorField, useForm, type FormError } from '@/hooks/useForm';
import Style from '@/components/ProductSearchForm.module.css';
import { ErrorList } from './form/ErrorList';
import { classes } from '@/styles/helper';
import { Button } from './form/Button';

function rangeValue<T extends number | null | undefined>(range: RangeValue<T>): RangeString {
	let rangestr = '';
	if (range[0]) {
		rangestr += range[0].toFixed(2);
	}
	rangestr += '..';
	if (range[1]) {
		rangestr += range[1].toFixed(2);
	}
	return rangestr as RangeString;
}

function parseInputNumber(value: string | number | undefined): number | null {
	const num = Number(value);
	if (Number.isNaN(num)) {
		return null;
	}
	return num;
}

function extractRangeString(data: ProductQueryFormData): RangeString | undefined {
	const min = parseInputNumber(data.range_min);
	const max = parseInputNumber(data.range_max);
	if (min === null || max === null) {
		return undefined;
	}
	return rangeValue([min, max]);
}

const ORDER_BY_VALUES: Array<SelectValue> = [
	{ label: 'none', value: '' },
	{ label: 'Expiration', value: 'exp' },
	{ label: 'US Dollar', value: 'usd' },
	{ label: 'Euro', value: 'eur' },
	{ label: 'Japanese Yen', value: 'jpy' },
	{ label: 'Brazilian Real', value: 'brl' },
	{ label: 'Bitcoin', value: 'btc' },
];

const ORDER_VALUES: Array<SelectValue> = [
	{ label: 'Descending', value: 'desc' },
	{ label: 'Ascending', value: 'asc' },
];

interface ProductQueryFormData {
	name?: string;
	order?: QueryOrder;
	orderby?: ProductOrderField;
	range_min?: number;
	range_max?: number;
	// rangeby?: 'usd' | 'eur' | 'jpy' | 'brl' | 'btc';
}

export type SubmitListProductQueryHandler = (
	value: ListProductQuery
) => Promise<Array<FormError<ListProductQuery>> | undefined>;

export type BaseProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>;

export interface ProductSearchFormProps extends BaseProps {
	onSubmit?: SubmitListProductQueryHandler;
}

export function ProductSearchForm({
	onSubmit,
	className,
	...props
}: ProductSearchFormProps): JSX.Element {
	const { handleChange, handleValue, reset, handleSubmit, data, errors } =
		useForm<ProductQueryFormData>({ onSubmit: queryProducts });

	async function queryProducts(
		data: ProductQueryFormData
	): Promise<Array<FormError<ProductQueryFormData>> | null | undefined> {
		const range = extractRangeString(data);
		const errors =
			(await onSubmit?.({
				name: data.name,
				order: data.order,
				orderby: data.orderby,
				range,
				rangeby: range ? 'usd' : undefined,
			})) ?? [];

		return errors.map(err => {
			if (err.field === 'range') {
				return { message: err.message, field: 'range_min' };
			}
			return err;
		});
	}

	const formErrors = mapFilterErrorField(errors, '@form-error');

	return (
		<form onSubmit={handleSubmit} className={classes(Style.container, className)} {...props}>
			<TextField
				name="name"
				type="text"
				label="Name"
				value={data.name ?? ''}
				errors={mapFilterErrorField(errors, 'name')}
				onChange={handleChange}
				wrapper={{ className: Style.name_field }}
			/>

			<div className={Style.range_container}>
				<TextField
					name="range_min"
					type="number"
					inputMode="decimal"
					label="Minimum price ($)"
					wrapper={{ className: Style.range_field }}
					value={data.range_min ?? ''}
					errors={mapFilterErrorField(errors, 'range_min')}
					onChange={ev => handleValue('range_min', ev.target.valueAsNumber)}
				/>
				<TextField
					name="range_max"
					type="number"
					inputMode="decimal"
					label="Maximum price ($)"
					wrapper={{ className: Style.range_field }}
					value={data.range_max ?? ''}
					errors={mapFilterErrorField(errors, 'range_max')}
					onChange={handleChange}
				/>
			</div>

			<div className={Style.order_container}>
				<SelectInput
					name="orderby"
					label="Order field"
					values={ORDER_BY_VALUES}
					value={data.orderby ?? ''}
					onValueChange={value => handleValue('orderby', value ?? undefined)}
				/>
				<SelectInput
					name="order"
					label="Order"
					values={ORDER_VALUES}
					value={data.order ?? ''}
					onValueChange={value => handleValue('order', value ?? undefined)}
				/>
			</div>

			<div className={Style.button_container}>
				<Button type="submit" className={Style.submit_button}>
					Submit
				</Button>
				<Button type="button" onClick={reset}>
					Reset
				</Button>
			</div>

			<ErrorList errors={formErrors} />
		</form>
	);
}
