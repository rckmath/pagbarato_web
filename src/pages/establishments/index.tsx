import { DataGrid, GridColDef, GridRowsProp, ptBR } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { FunctionComponent, SyntheticEvent, useEffect, useState } from 'react';

import { api, queryClient } from '../../services/api';
import { UserAuth } from '../../context/AuthProvider';
import { EstablishmentType } from '../../services/establishment';

import DataGridToolbar from '../../components/DataGrid/DataGridToolbar';
import DataGridLoading from '../../components/DataGrid/DataGridLoading';
import DataGridOverlay from '../../components/DataGrid/DataGridOverlay';
import { createdAtColumnType, deleteColumnType } from '../../components/DataGrid/DataGridCustomColumn';
import SnackbarAlert from '../../components/SnackbarAlert';
import ConfirmDialog from '../../components/ConfirmDialog';

interface EstablishmentsProps {}

const Establishments: FunctionComponent<EstablishmentsProps> = () => {
  const [uid, setUid] = useState('');
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [rows, setRows] = useState<GridRowsProp<EstablishmentType>>([]);
  const [rowCountState, setRowCountState] = useState<number>(count);
  const [showSuccessDeleteMessage, setShowSuccessDeleteMessage] = useState(false);

  const { user } = UserAuth();
  const localToken = sessionStorage.getItem('accessToken');

  const {
    isFetching,
    isError,
    refetch,
    data: establishmentsList,
  } = useQuery<EstablishmentType[]>(
    ['establishmentsList', page, pageSize],
    async () => {
      const accessToken = user?.accessToken || localToken;

      const { data: response } = await api.get(`/establishment?page=${page + 1}&pageSize=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setCount(response.data.count);
      return response.data.records;
    },
    {
      keepPreviousData: true,
      staleTime: 3500 * 60, // 3.5 minutes
    },
  );

  const handleSuccessDeleteClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setShowSuccessDeleteMessage(false);
  };

  const handleDelete = async (confirm = false) => {
    const accessToken = user?.accessToken || localToken;

    setConfirmDelete(false);

    if (!confirm) return;

    await api.delete(`/establishment/${uid}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    queryClient.invalidateQueries(['establishmentsList'])
    setShowSuccessDeleteMessage(true);
    refetch();
  };

  useEffect(() => {
    if (establishmentsList) setRows([...establishmentsList]);
  }, [establishmentsList]);

  useEffect(() => {
    setRowCountState((prevRowCountState) => (count !== undefined ? count : prevRowCountState));
  }, [count, setRowCountState]);

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
          rows={rows}
          columns={columns}
          disableSelectionOnClick
          pagination
          rowCount={rowCountState}
          paginationMode="server"
          page={page}
          pageSize={pageSize}
          rowsPerPageOptions={[10, 15, 20, 30]}
          loading={isFetching}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(pageSize) => setPageSize(pageSize)}
          initialState={{
            sorting: {
              sortModel: [{ field: 'createdAt', sort: 'desc' }],
            },
          }}
          sx={{
            minHeight: '44.5vh',
            maxHeight: '80vh',
            borderRadius: 2,
            '& .MuiCircularProgress-root': {
              color: '#ef8f01',
            },
            '& .MuiCheckbox-root.Mui-checked': {
              color: '#ef8f01',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#ef8f0130',
            },
          }}
          components={{
            Toolbar: DataGridToolbar,
            LoadingOverlay: DataGridLoading,
            NoRowsOverlay: () => <DataGridOverlay error={isError} />,
          }}
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
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
