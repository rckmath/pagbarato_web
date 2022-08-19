import { Price, PriceForm } from '../models/price';
import { api, IBaseResponse, PaginatedResponseType } from './api';

export const getPrices = async (params?: any): Promise<Price[]> => {
  const { data: response }: IBaseResponse = await api.get('/price', {
    headers: { Authorization: `Bearer ${params?.accessToken}` },
    params: { paginate: false },
  });

  return response.data;
};

export const getPricesPaginated = async (page: number, pageSize: number, params?: any): Promise<PaginatedResponseType<Price>> => {
  const { data: response }: IBaseResponse = await api.get('/price', {
    headers: { Authorization: `Bearer ${params?.accessToken}` },
    params: {
      page: page + 1,
      pageSize,
      includeDetails: true,
    },
  });

  return response.data;
};

export const getPriceById = async (id: string, params?: any): Promise<Price> => {
  const { data: response }: IBaseResponse = await api.get(`/price/${id}`, {
    headers: { Authorization: `Bearer ${params?.accessToken}` },
    params: { includeDetails: true },
  });
  return response.data;
};

export const updatePrice = async (id: string, data: PriceForm, params?: any): Promise<Price> => {
  const { data: response }: IBaseResponse = await api.put(`/price/${id}`, data, {
    headers: { Authorization: `Bearer ${params?.accessToken}` },
  });
  return response.data;
};
