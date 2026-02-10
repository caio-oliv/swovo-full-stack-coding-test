import type { JSX } from 'react';
import { Progress as Prog } from '@base-ui/react/progress';
import Style from '@/components/form/Progress.module.css';

export interface ProgressProps {
	label?: string;
	value?: number;
	min?: number;
	max?: number;
}

export function Progress({ label, value = 0, min = 0, max = 100 }: ProgressProps): JSX.Element {
	return (
		<Prog.Root className={Style.container} value={value} min={min} max={max}>
			<Prog.Label className={Style.label}>{label}</Prog.Label>
			<Prog.Value className={Style.value} />
			<Prog.Track className={Style.track}>
				<Prog.Indicator className={Style.indicator} />
			</Prog.Track>
		</Prog.Root>
	);
}
