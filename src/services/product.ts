import { Product, ProductForm } from '../models/product';
import { api, IBaseResponse, PaginatedResponseType } from './api';

export const getProducts = async (params?: any): Promise<Product[]> => {
  const { data: response }: IBaseResponse = await api.get('/product', {
    headers: { Authorization: `Bearer ${params?.accessToken}` },
    params: { paginate: false, priceFiltering: false },
  });

  return response.data;
};

export const getProductsPaginated = async (page: number, pageSize: number, params?: any): Promise<PaginatedResponseType<Product>> => {
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

export const getProductById = async (id: string, params?: any): Promise<Product> => {
  const { data: response }: IBaseResponse = await api.get(`/product/${id}`, {
    headers: { Authorization: `Bearer ${params?.accessToken}` },
    params: { rangeFiltering: false },
  });
  return response.data;
};

export const updateProduct = async (id: string, data: ProductForm, params?: any): Promise<Product> => {
  const { data: response }: IBaseResponse = await api.put(`/product/${id}`, data, {
    headers: { Authorization: `Bearer ${params?.accessToken}` },
  });
  return response.data;
};
