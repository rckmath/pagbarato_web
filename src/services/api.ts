import { QueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { config } from '../config';

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

const api = axios.create({ baseURL: config.baseApiUrl });

export const errorDispatcher = async (err: AxiosError<IBaseResponse>, refresh: () => Promise<void>) => {
  if (err.response?.status === 403 && err.response?.data?.error?.name === 'AuthenticationException') {
    await refresh();
  }
};

const queryClient = new QueryClient();

export { api, queryClient };
