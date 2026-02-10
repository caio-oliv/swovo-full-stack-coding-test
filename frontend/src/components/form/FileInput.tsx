import React, {
	useRef,
	type JSX,
	type ChangeEvent,
	type InputHTMLAttributes,
	type HTMLAttributes,
} from 'react';
import Style from '@/components/form/FileInput.module.css';
import { classes } from '@/styles/helper';

export type ContainerProps = HTMLAttributes<HTMLDivElement>;

type InnerInputProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'value' | 'type' | 'onClick' | 'onInput' | 'onChange' | 'ref'
>;

export type FileHandler = (file: File) => void;

export interface FileInputProps extends InnerInputProps {
	file?: File | null;
	onFile?: FileHandler;
	wrapper?: ContainerProps;
}

export function FileInput({
	file,
	onFile,
	className,
	wrapper = {},
	...props
}: FileInputProps): JSX.Element {
	const fileInputRef = useRef<HTMLInputElement>(null);

	function handleUploadClick(): void {
		fileInputRef.current?.click();
	}

	function updateFile(event: ChangeEvent<HTMLInputElement>): void {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];
			onFile?.(file);
		}
	}

	function handleDragOver(event: React.DragEvent<HTMLDivElement>): void {
		event.preventDefault();
	}

	function handleFileDrop(event: React.DragEvent<HTMLDivElement>): void {
		event.preventDefault();
		if (event.dataTransfer.files && event.dataTransfer.files[0]) {
			const file = event.dataTransfer.files[0];
			onFile?.(file);
		}
	}

	return (
		<div {...wrapper} className={classes(Style.container, wrapper.className)}>
			<div
				className={Style.drop_zone}
				onDragOver={handleDragOver}
				onDrop={handleFileDrop}
				onClick={handleUploadClick}
			>
				{file ? <span>{file.name}</span> : <span>Choose file or drag it here</span>}
				<input
					type="file"
					{...props}
					className={classes(className, Style.file_input)}
					onChange={updateFile}
					ref={fileInputRef}
				/>
			</div>
		</div>
	);
}
