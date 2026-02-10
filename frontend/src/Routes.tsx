import type { JSX } from 'react';
import { Routes, Route } from 'react-router';
import { RootScreen } from '@/screens/Root';
import { ImportProductScreen } from '@/screens/ImportProducts';

export function Router(): JSX.Element {
	return (
		<Routes>
			<Route path="/" index element={<RootScreen />} />
			<Route path="/import-product" element={<ImportProductScreen />} />
		</Routes>
	);
}
