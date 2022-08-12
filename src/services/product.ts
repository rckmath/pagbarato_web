import { Product } from '../models/product';
import { api, IBaseResponse, PaginatedResponseType } from './api';

export const getProducts = async (page: number, pageSize: number, params?: any): Promise<PaginatedResponseType<Product>> => {
  const { data: response }: IBaseResponse = await api.get('/product', {
    headers: { Authorization: `Bearer ${params?.accessToken}` },
    params: {
      page: page + 1,
      pageSize,
      priceFiltering: false,
    },
  });
  return response.data;
};
