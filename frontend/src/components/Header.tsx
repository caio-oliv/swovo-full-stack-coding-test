import type { JSX } from 'react';
import { Link } from 'react-router';
import Style from '@/components/Header.module.css';

export function Header(): JSX.Element {
	return (
		<header className={Style.container}>
			<nav>
				<ul className={Style.list}>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/import-product">Import products</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
}
