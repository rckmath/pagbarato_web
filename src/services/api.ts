import { QueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { config } from '../config';
import { IUserAuth } from '../context/AuthContext';
import { useAuth } from '../context/AuthProvider';

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

export const errorDispatcher = (err: AxiosError<IBaseResponse>, user: IUserAuth | null) => {
  if (err.response?.status === 403 && err.response?.data?.error?.name === 'AuthenticationException') {
    if (user) {
      user.getIdToken(true).then((x) => sessionStorage.setItem('accessToken', x));
    }
  }
};

const queryClient = new QueryClient();

export { api, queryClient };
