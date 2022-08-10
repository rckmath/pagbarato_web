import { FunctionComponent, SyntheticEvent, useEffect, useState } from 'react';

import { DataGrid, GridRowsProp, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Close, HowToReg } from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import ConfirmDialog from '../components/ConfirmDialog';
import SnackbarAlert from '../components/SnackbarAlert';
import { dataGridBasePropDefinitions } from '../components/DataGrid/DataGridBaseConfig';
import { createdAtColumnType, deleteColumnType } from '../components/DataGrid/DataGridCustomColumns';

import { api, PaginatedResponseType } from '../services/api';
import { UserRoleType, User } from '../models/user';
import { useAuth } from '../context/AuthProvider';
import { getUsers } from '../services/user';

interface UsersProps {}

const Users: FunctionComponent<UsersProps> = () => {
  const [uid, setUid] = useState('');
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [rowCountState, setRowCountState] = useState<number>(0);
  const [rowsState, setRowsState] = useState<GridRowsProp<User>>([]);
  const [showSuccessDeleteMessage, setShowSuccessDeleteMessage] = useState(false);

  const { user } = useAuth();
  const accessToken = user?.accessToken || sessionStorage.getItem('accessToken');
  const queryClient = useQueryClient();

  const { isLoading, isFetching, isError, data } = useQuery<PaginatedResponseType<User>>(
    ['usersList', page, pageSize],
    () => getUsers(page, pageSize, { accessToken }),
    { keepPreviousData: true, staleTime: 2000 * 60 },
  );

  const handleSuccessDeleteClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setShowSuccessDeleteMessage(false);
  };

  const handleDelete = async (confirm = false) => {
    setConfirmDelete(false);
    if (!confirm) return;
    await api.delete('/user/' + uid, { headers: { Authorization: `Bearer ${accessToken}` } });
    queryClient.invalidateQueries(['usersList']);
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
    { field: 'email', headerName: 'E-mail', minWidth: 200, flex: 1 },
    {
      field: 'role',
      headerName: 'Admin?',
      minWidth: 72,
      maxWidth: 90,
      flex: 1,
      type: 'singleSelect',
      valueOptions: [UserRoleType.ADMIN, UserRoleType.CONSUMER],
      renderCell: (params: GridRenderCellParams<any>) => (
        <div style={{ color: 'rgba(0, 0, 0, 0.54)' }}>{params.value === 'ADMIN' ? <HowToReg /> : <Close />}</div>
      ),
    },
    { field: 'createdAt', ...createdAtColumnType },
    {
      field: 'delete',
      ...deleteColumnType({
        toNotDeleteCompareValue: user?.email,
        toNotDeleteCompareProp: 'email',
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
      <h1 className="text-4xl font-bold">Usuários</h1>
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
        content={`Deseja mesmo apagar o usuário selecionado?`}
        openDialog={confirmDelete}
        confirmAction={handleDelete}
      />
      <SnackbarAlert
        backgroundColor="#367315"
        open={showSuccessDeleteMessage}
        text="Usuário excluído com sucesso!"
        handleClose={handleSuccessDeleteClose}
      />
    </div>
  );
};

export default Users;
