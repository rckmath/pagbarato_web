import { Price } from '../models/price';
import { api, IBaseResponse, PaginatedResponseType } from './api';

export const getPrices = async (page: number, pageSize: number, params?: any): Promise<PaginatedResponseType<Price>> => {
  const { data: response }: IBaseResponse = await api.get('/price', {
    headers: { Authorization: `Bearer ${params?.accessToken}` },
    params: {
      page: page + 1,
      pageSize,
      includeDetails: true
    },
  });

  return response.data;
};
