import { DashboardTotals } from '../models/dashboard';
import { api, IBaseResponse } from './api';

export const getTotals = async (params?: any): Promise<DashboardTotals> => {
  const { data: response }: IBaseResponse = await api.get('/dashboard/count', {
    headers: { Authorization: `Bearer ${params?.accessToken}` },
    params: {
      fromDate: params.fromDate,
      toDate: params.toDate,
    },
  });

  return response.data;
};
