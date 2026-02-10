import { useState, type JSX } from 'react';
import { Header } from '@/components/Header';
import { classes } from '@/styles/helper';
import UtilStyle from '@/styles/utils.module.css';
import Style from '@/screens/ImportProductScreen.module.css';
import { uploadProductCSV, type ImportProductInput } from '@/services/Product';
import { ImportProductForm, type ImportProductFormData } from '@/components/ImportProductForm';
import type { FormError } from '@/hooks/useForm';
import { Progress } from '@/components/form/Progress';
import { Link } from 'react-router';
import type { ImportProductResource } from '@/services/Resource';

export function ImportProductScreen(): JSX.Element {
	const [progress, setProgress] = useState(0);
	const [uploading, setUploading] = useState(false);
	const [importResult, setImportResult] = useState<ImportProductResource | null>(null);

	async function importProduct(
		data: ImportProductFormData
	): Promise<Array<FormError<ImportProductFormData>>> {
		const errors: Array<FormError<ImportProductFormData>> = [];

		const input: ImportProductInput = {
			file: data.file,
			filename: data.file.name,
			strategy: data.strategy,
		};

		setUploading(true);
		const result = await uploadProductCSV(input, {
			progress: event => setProgress((event.loaded / event.total) * 100),
		});
		setUploading(false);

		switch (result.type) {
			case 'SUCCESS': {
				setImportResult(result.value);
				break;
			}
			case 'VALIDATION': {
				for (const issue of result.value.issues) {
					errors.push({ field: '@form-error', message: issue.message });
				}
				break;
			}
			default: {
				// eslint-disable-next-line no-console
				console.log(result.value);
				errors.push({
					field: '@form-error',
					message: 'An error occured importing the products CSV',
				});
			}
		}

		return errors;
	}

	return (
		<main className={classes(UtilStyle.screen, Style.container)}>
			<Header />

			<ImportProductForm onSubmit={importProduct} disableSubmit={importResult !== null} />

			{uploading ? <Progress label="Upload" min={0} max={100} value={progress} /> : null}

			{importResult ? (
				<div className={Style.success_container}>
					<p className={Style.success_message}>Products imported successfully.</p>

					<span>
						Batch id: <code>{importResult.batch.id}</code>
					</span>
					<span>Total imported: {importResult.imported}</span>
					<span>Errors found: {importResult.issues.length}</span>

					<Link to={`/?batchid=${importResult.batch.id}`} className={Style.products_link}>
						Go to imported products
					</Link>
				</div>
			) : null}

			{importResult && importResult.issues.length !== 0 ? (
				<div className={Style.alert_container}>
					<p className={Style.success_message}>Errors reported:</p>
					<ul>
						{importResult.issues.map(issue => (
							<li>
								{issue.path} - {issue.message}
							</li>
						))}
					</ul>
				</div>
			) : null}
		</main>
	);
}
