import { DataGrid, GridColDef, GridRowsProp, ptBR } from '@mui/x-data-grid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FunctionComponent, SyntheticEvent, useEffect, useState } from 'react';

import { useAuth } from '../context/AuthProvider';
import { EstablishmentType } from '../models/establishment';
import { api, PaginatedResponseType } from '../services/api';
import { getEstablishments } from '../services/establishment';

import SnackbarAlert from '../components/SnackbarAlert';
import ConfirmDialog from '../components/ConfirmDialog';
import { createdAtColumnType, deleteColumnType } from '../components/DataGrid/DataGridCustomColumns';
import { dataGridBasePropDefinitions } from '../components/DataGrid/DataGridBaseConfig';

interface EstablishmentsProps {}

const Establishments: FunctionComponent<EstablishmentsProps> = () => {
  const [uid, setUid] = useState('');
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [rowsState, setRowsState] = useState<GridRowsProp<EstablishmentType>>([]);
  const [rowCountState, setRowCountState] = useState<number>(0);
  const [showSuccessDeleteMessage, setShowSuccessDeleteMessage] = useState(false);

  const { user } = useAuth();
  const accessToken = user?.accessToken || sessionStorage.getItem('accessToken');
  const queryClient = useQueryClient();

  const { isLoading, isFetching, isError, data } = useQuery<PaginatedResponseType<EstablishmentType>>(
    ['establishmentsList', page, pageSize],
    () => getEstablishments(page, pageSize, { accessToken }),
    { keepPreviousData: true, staleTime: 3500 * 60 },
  );

  const handleSuccessDeleteClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setShowSuccessDeleteMessage(false);
  };

  const handleDelete = async (confirm = false) => {
    setConfirmDelete(false);
    if (!confirm) return;
    await api.delete('/establishment/' + uid, { headers: { Authorization: `Bearer ${accessToken}` } });
    queryClient.invalidateQueries(['establishmentsList']);
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
    { field: 'name', headerName: 'Nome', minWidth: 100, flex: 1 },
    { field: 'latitude', headerName: 'Latitude', minWidth: 200, flex: 1 },
    { field: 'longitude', headerName: 'Longitude', minWidth: 200, flex: 1 },
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
      <h1 className="text-4xl font-bold">Estabelecimentos</h1>
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
        content={`Deseja mesmo apagar o estabelecimento selecionado?`}
        openDialog={confirmDelete}
        confirmAction={handleDelete}
      />
      <SnackbarAlert
        backgroundColor="#367315"
        open={showSuccessDeleteMessage}
        text="Estabelecimento excluído com sucesso!"
        handleClose={handleSuccessDeleteClose}
      />
    </div>
  );
};

export default Establishments;
