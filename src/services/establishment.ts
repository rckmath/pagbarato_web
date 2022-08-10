import { EstablishmentType } from '../models/establishment';
import { api, IBaseResponse, PaginatedResponseType } from './api';

export const getEstablishments = async (
  page: number,
  pageSize: number,
  params?: any,
): Promise<PaginatedResponseType<EstablishmentType>> => {
  const { data: response }: IBaseResponse = await api.get('/establishment', {
    headers: { Authorization: `Bearer ${params?.accessToken}` },
    params: {
      page: page + 1,
      pageSize,
    },
  });

  return response.data;
};
