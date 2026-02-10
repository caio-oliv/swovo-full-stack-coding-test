export function apiEndpoint(path: string): URL {
	return new URL(path, import.meta.env.VITE_APP_API_ADDRESS);
}
