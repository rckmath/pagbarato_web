import { User } from '../models/user';
import { api, IBaseResponse, PaginatedResponseType } from './api';

export const getUsers = async (page: number, pageSize: number, params?: any): Promise<PaginatedResponseType<User>> => {
  const { data: response }: IBaseResponse = await api.get('/user', {
    headers: { Authorization: `Bearer ${params?.accessToken}` },
    params: {
      page: page + 1,
      pageSize,
    },
  });
  return response.data;
};
