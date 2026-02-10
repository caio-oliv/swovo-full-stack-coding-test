import { StrictMode, type JSX } from 'react';
import { BrowserRouter } from 'react-router';
import { Router } from '@/Routes';

export function App(): JSX.Element {
	return (
		<StrictMode>
			<BrowserRouter>
				<Router />
			</BrowserRouter>
		</StrictMode>
	);
}
