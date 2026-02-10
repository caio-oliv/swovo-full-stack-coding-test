import type { JSX } from 'react';
import { Slider } from '@base-ui/react/slider';
import Style from '@/components/form/RangeSlider.module.css';

export type Range = [number, number];

export type ValueChangeHandler = (value: Range, details: Slider.Root.ChangeEventDetails) => void;
export type ValueCommittedHandler = (value: Range, details: Slider.Root.CommitEventDetails) => void;

export interface RangeSliderProps {
	name?: string;
	defaultValue?: Range;
	value?: Range;
	min?: number;
	max?: number;
	disabled?: boolean;
	onValueChange?: ValueChangeHandler;
	onValueCommited?: ValueCommittedHandler;
}

export function RangeSlider({
	name,
	defaultValue,
	value,
	min,
	max,
	disabled,
}: RangeSliderProps): JSX.Element {
	return (
		<Slider.Root
			defaultValue={defaultValue}
			value={value}
			name={name}
			min={min}
			max={max}
			disabled={disabled}
		>
			<Slider.Control className={Style.control}>
				<Slider.Track className={Style.track}>
					<Slider.Indicator className={Style.indicator} />
					<Slider.Thumb index={0} className={Style.thumb} />
					<Slider.Thumb index={1} className={Style.thumb} />
				</Slider.Track>
			</Slider.Control>
		</Slider.Root>
	);
}
