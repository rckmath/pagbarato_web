import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FunctionComponent, SyntheticEvent, useEffect, useState } from 'react';

import { useAuth } from '../context/AuthProvider';
import { Price, PriceType } from '../models/price';
import { api, PaginatedResponseType } from '../services/api';
import { getPrices } from '../services/price';

import SnackbarAlert from '../components/SnackbarAlert';
import ConfirmDialog from '../components/ConfirmDialog';
import { createdAtColumnType, deleteColumnType, priceColumnType } from '../components/DataGrid/DataGridCustomColumns';
import { dataGridBasePropDefinitions } from '../components/DataGrid/DataGridBaseConfig';

interface PricesProps {}

const Prices: FunctionComponent<PricesProps> = () => {
  const [uid, setUid] = useState('');
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [rowsState, setRowsState] = useState<GridRowsProp<Price>>([]);
  const [rowCountState, setRowCountState] = useState<number>(0);
  const [showSuccessDeleteMessage, setShowSuccessDeleteMessage] = useState(false);

  const { user } = useAuth();
  const accessToken = user?.accessToken || sessionStorage.getItem('accessToken');
  const queryClient = useQueryClient();

  const { isLoading, isFetching, isError, data } = useQuery<PaginatedResponseType<Price>>(
    ['pricesList', page, pageSize],
    () => getPrices(page, pageSize, { accessToken }),
    { keepPreviousData: true, staleTime: 1000 * 60 },
  );

  const handleSuccessDeleteClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setShowSuccessDeleteMessage(false);
  };

  const handleDelete = async (confirm = false) => {
    setConfirmDelete(false);
    if (!confirm) return;
    await api.delete('/price/' + uid, { headers: { Authorization: `Bearer ${accessToken}` } });
    queryClient.invalidateQueries(['pricesList']);
    setShowSuccessDeleteMessage(true);
  };

  useEffect(() => {
    setRowsState((prevRowsState) => (data?.records !== undefined ? data.records : prevRowsState));
  }, [data?.records, setRowsState]);

  useEffect(() => {
    setRowCountState((prevRowCountState) => (data?.count !== undefined ? data.count : prevRowCountState));
  }, [data?.count, setRowCountState]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'UID', hide: true, flex: 1 },
    { field: 'value', headerName: 'Valor', ...priceColumnType },
    {
      field: 'type',
      headerName: 'Tipo',
      minWidth: 72,
      maxWidth: 120,
      flex: 1,
      type: 'singleSelect',
      valueOptions: [PriceType.COMMON, PriceType.DEAL],
    },
    { field: 'isProductWithNearExpirationDate', type: 'boolean', minWidth: 72, maxWidth: 160, headerName: 'Próx. da validade?', flex: 1 },
    { field: 'createdAt', ...createdAtColumnType },
    {
      field: 'delete',
      ...deleteColumnType({
        action: (id) => {
          if (!id) return;
          setConfirmDelete(true);
          setUid(id);
        },
      }),
    },
  ];

  return (
    <div className="flex flex-col">
      <h1 className="text-4xl font-bold">Preços</h1>
      <div className="mt-8 w-full h-[74vh]">
        <DataGrid
          {...dataGridBasePropDefinitions({ isError })}
          rows={rowsState}
          columns={columns}
          rowCount={rowCountState}
          page={page}
          pageSize={pageSize}
          loading={isLoading || isFetching}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(pageSize) => setPageSize(pageSize)}
        />
      </div>
      <ConfirmDialog
        title="Confirmar ação"
        content={`Deseja mesmo apagar o preço selecionado?`}
        openDialog={confirmDelete}
        confirmAction={handleDelete}
      />
      <SnackbarAlert
        backgroundColor="#367315"
        open={showSuccessDeleteMessage}
        text="Preço excluído com sucesso!"
        handleClose={handleSuccessDeleteClose}
      />
    </div>
  );
};

export default Prices;
