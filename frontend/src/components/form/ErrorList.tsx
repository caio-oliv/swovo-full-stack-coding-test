import { type HTMLAttributes, type JSX, Fragment } from 'react';
import Style from '@/components/form/ErrorList.module.css';
import { classes } from '@/styles/helper';

export type BaseProps = HTMLAttributes<HTMLDivElement>;

export interface ErrorListProps extends BaseProps {
	errors?: Array<string>;
}

export function ErrorList({ errors = [], className, ...props }: ErrorListProps): JSX.Element {
	if (errors.length === 0) {
		return <Fragment />;
	}

	return (
		<div className={classes(Style.container, className)} {...props}>
			{errors.map(err => (
				<p key={err}>{err}</p>
			))}
		</div>
	);
}
