import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api' });

const queryClient = new QueryClient();

export { api, queryClient };
