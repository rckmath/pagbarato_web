import { User, UserForm } from '../models/user';
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

export const getUserById = async (id: string, params?: any): Promise<User> => {
  const { data: response }: IBaseResponse = await api.get(`/user/${id}`, {
    headers: { Authorization: `Bearer ${params?.accessToken}` },
  });
  return response.data;
};

export const updateUser = async (id: string, data: UserForm, params?: any): Promise<User> => {
  const { data: response }: IBaseResponse = await api.put(`/user/${id}`, data, {
    headers: { Authorization: `Bearer ${params?.accessToken}` },
  });
  return response.data;
};
