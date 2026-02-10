import { type HTMLAttributes, type InputHTMLAttributes, type JSX, type Ref } from 'react';
import { Field } from '@base-ui/react/field';
import { ErrorList } from '@/components/form/ErrorList';
import { classes } from '@/styles/helper';
import Style from '@/components/form/TextField.module.css';

type BaseProps = InputHTMLAttributes<HTMLInputElement>;

export type WrapperProps = HTMLAttributes<HTMLDivElement>;

export interface TextFieldProps extends BaseProps {
	label?: string;
	helperText?: string;
	errors?: Array<string>;
	wrapper?: WrapperProps;
	ref?: Ref<HTMLInputElement>;
}

export function TextField({
	label,
	helperText,
	errors = [],
	className,
	wrapper = {},
	ref,
	...props
}: TextFieldProps): JSX.Element {
	return (
		<Field.Root {...wrapper} className={classes(Style.Field, wrapper.className)}>
			{label ? <Field.Label className={Style.Label}>{label}</Field.Label> : null}
			{helperText ? (
				<Field.Description className={Style.Description}>{helperText}</Field.Description>
			) : null}

			<Field.Control {...props} className={classes(Style.Input, className)} ref={ref} />

			<ErrorList errors={errors} />
		</Field.Root>
	);
}
