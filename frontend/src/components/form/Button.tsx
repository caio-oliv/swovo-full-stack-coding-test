import type { ButtonHTMLAttributes, JSX } from 'react';
import Style from '@/components/form/Button.module.css';
import { classes } from '@/styles/helper';

export type BaseProps = ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonProps = BaseProps;

export function Button({ children, className, ...props }: ButtonProps): JSX.Element {
	return (
		<button
			className={classes(Style.button, className)}
			data-disabled={props.disabled ? '' : undefined}
			{...props}
		>
			{children}
		</button>
	);
}
