import type { JSX, TableHTMLAttributes } from 'react';
import type { ProductResource, SerializableCurrencyType } from '@/services/Resource';
import { classes } from '@/styles/helper';
import Style from '@/components/ProductTable.module.css';

function formatDate(date: Date): string {
	return new Date(date).toLocaleDateString();
}

function formatPrice(price: SerializableCurrencyType): string {
	return price.code + ' ' + price.amount;
}

export type BaseProps = TableHTMLAttributes<HTMLTableElement>;

export interface ProductTableProps extends BaseProps {
	products: Array<ProductResource>;
}

export function ProductTable({ products, className, ...props }: ProductTableProps): JSX.Element {
	return (
		<table {...props} className={classes(Style.container, className)}>
			<thead className={Style.head_container}>
				<tr>
					<th>ID</th>
					<th>Created</th>
					<th>Name</th>
					<th>Expiration</th>
					<th>Batch ID</th>
					<th>USD</th>
					<th>EUR</th>
					<th>JPY</th>
					<th>BRL</th>
					<th>BTC</th>
				</tr>
			</thead>

			<tbody className={Style.body_container}>
				{products.map(product => (
					<tr key={product.id}>
						<td>{product.id}</td>
						<td>{formatDate(product.created)}</td>
						<td className={Style.name_cell}>{product.name}</td>
						<td>{formatDate(product.expiration)}</td>
						<td>{product.batch_id ?? '-'}</td>

						<td>{formatPrice(product.prices.usd)}</td>
						<td>{formatPrice(product.prices.eur)}</td>
						<td>{formatPrice(product.prices.jpy)}</td>
						<td>{formatPrice(product.prices.brl)}</td>
						<td>{formatPrice(product.prices.btc)}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
