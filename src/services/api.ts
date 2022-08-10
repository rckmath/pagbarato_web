import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface IBaseResponse {
  data?: any;
  error?: any;
  statusCode?: number;
}

export type PaginatedResponseType<T> = {
  page: number;
  count: number;
  records: Array<T>;
};

const api = axios.create({ baseURL: 'http://localhost:3000/api' });

const queryClient = new QueryClient();

export { api, queryClient };
