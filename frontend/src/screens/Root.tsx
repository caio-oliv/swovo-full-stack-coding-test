import { useState, type JSX } from 'react';
import { ProductSearchForm } from '@/components/ProductSearchForm';
import { ProductTable } from '@/components/ProductTable';
import { Header } from '@/components/Header';
import type { FormError } from '@/hooks/useForm';
import { listProduct, type ListProductQuery } from '@/services/Product';
import type { ProductResource } from '@/services/Resource';
import UtilStyle from '@/styles/utils.module.css';
import Style from '@/screens/RootScreen.module.css';
import { classes } from '@/styles/helper';

export function RootScreen(): JSX.Element {
	const [products, setProducts] = useState<Array<ProductResource>>([]);

	async function getProducts(query: ListProductQuery): Promise<Array<FormError<ListProductQuery>>> {
		const errors: Array<FormError<ListProductQuery>> = [];

		const result = await listProduct(query);
		switch (result.type) {
			case 'SUCCESS': {
				setProducts(result.value);
				break;
			}
			default: {
				errors.push({
					field: '@form-error',
					message: 'Unexpected error occurred while querying products',
				});
			}
		}

		return errors;
	}

	return (
		<main className={classes(UtilStyle.screen, Style.container)}>
			<Header />

			<ProductSearchForm onSubmit={getProducts} />

			<div className={Style.table_container}>
				<ProductTable products={products} />
			</div>
		</main>
	);
}
