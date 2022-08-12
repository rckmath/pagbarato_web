import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';

import './index.css';
import App from './App';
import { queryClient } from './services/api';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
