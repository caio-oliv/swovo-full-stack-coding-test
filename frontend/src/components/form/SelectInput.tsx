import type { JSX } from 'react';
import { Select } from '@base-ui/react/select';
import { Field } from '@base-ui/react/field';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { ChevronUpDownIcon } from '@/components/icons/ChevronUpDownIcon';
import Style from '@/components/form/SelectInput.module.css';

export interface SelectValue {
	readonly label: string;
	readonly value: string;
}

export type ValueChangeHandler = (
	value: string | null,
	details: Select.Root.ChangeEventDetails
) => void;

export interface SelectInputProps {
	label?: string;
	values: Array<SelectValue>;
	name?: string;
	defaultValue?: string;
	value?: string;
	disabled?: boolean;
	onValueChange?: ValueChangeHandler;
}

export function SelectInput({
	label,
	values,
	name,
	defaultValue,
	value,
	disabled,
	onValueChange,
}: SelectInputProps): JSX.Element {
	return (
		<Field.Root className={Style.Field}>
			{label ? (
				<Field.Label className={Style.Label} nativeLabel={false} render={<div />}>
					{label}
				</Field.Label>
			) : null}
			<Select.Root
				items={values}
				defaultOpen={false}
				highlightItemOnHover
				name={name}
				defaultValue={defaultValue}
				value={value}
				disabled={disabled}
				onValueChange={onValueChange}
			>
				<Select.Trigger className={Style.Select}>
					<Select.Value className={Style.Value} />
					<Select.Icon className={Style.SelectIcon}>
						<ChevronUpDownIcon />
					</Select.Icon>
				</Select.Trigger>
				<Select.Portal>
					<Select.Positioner className={Style.Positioner} sideOffset={8}>
						<Select.Popup className={Style.Popup}>
							<Select.ScrollUpArrow className={Style.ScrollArrow} />
							<Select.List className={Style.List}>
								{values.map(({ label, value }) => (
									<Select.Item key={label} value={value} className={Style.Item}>
										<Select.ItemIndicator className={Style.ItemIndicator}>
											<CheckIcon className={Style.ItemIndicatorIcon} />
										</Select.ItemIndicator>
										<Select.ItemText className={Style.ItemText}>{label}</Select.ItemText>
									</Select.Item>
								))}
							</Select.List>
							<Select.ScrollDownArrow className={Style.ScrollArrow} />
						</Select.Popup>
					</Select.Positioner>
				</Select.Portal>
			</Select.Root>
		</Field.Root>
	);
}
