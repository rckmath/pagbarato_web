import { Establishment, EstablishmentForm } from '../models/establishment';
import { api, IBaseResponse, PaginatedResponseType } from './api';

export const getEstablishments = async (params?: any): Promise<Establishment[]> => {
  const { data: response }: IBaseResponse = await api.get('/establishment', {
    headers: { Authorization: `Bearer ${params?.accessToken}` },
    params: { paginate: false },
  });

  return response.data;
};

export const getEstablishmentsPaginated = async (
  page: number,
  pageSize: number,
  params?: any,
): Promise<PaginatedResponseType<Establishment>> => {
  const { data: response }: IBaseResponse = await api.get('/establishment', {
    headers: { Authorization: `Bearer ${params?.accessToken}` },
    params: {
      page: page + 1,
      pageSize,
    },
  });

  return response.data;
};

export const getEstablishmentById = async (id: string, params?: any): Promise<Establishment> => {
  const { data: response }: IBaseResponse = await api.get(`/establishment/${id}`, {
    headers: { Authorization: `Bearer ${params?.accessToken}` },
  });
  return response.data;
};

export const updateEstablishment = async (id: string, data: EstablishmentForm, params?: any): Promise<Establishment> => {
  const { data: response }: IBaseResponse = await api.put(`/establishment/${id}`, data, {
    headers: { Authorization: `Bearer ${params?.accessToken}` },
  });
  return response.data;
};
