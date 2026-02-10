import { createRoot } from 'react-dom/client';
import { App } from '@/App.tsx';
import '@/styles/main.css';

const rootEl = document.getElementById('root')!;
const root = createRoot(rootEl);

root.render(<App />);
