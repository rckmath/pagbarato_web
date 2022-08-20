import { FunctionComponent, SyntheticEvent, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Close, HowToReg, PersonAdd } from '@mui/icons-material';
import { DataGrid, GridRowsProp, GridRenderCellParams, GridColumns } from '@mui/x-data-grid';

import ConfirmDialog from '../../components/ConfirmDialog';
import SnackbarAlert from '../../components/SnackbarAlert';
import { dataGridBasePropsDefinitions } from '../../components/DataGrid/DataGridBaseConfig';
import { actionsColumnMenu, dateAndTimeColumnType } from '../../components/DataGrid/DataGridCustomColumns';

import { api, errorDispatcher, IBaseResponse, PaginatedResponseType } from '../../services/api';
import { UserRoleType, User } from '../../models/user';
import { useAuth } from '../../context/AuthProvider';
import { getUsersPaginated } from '../../services/user';
import { AxiosError } from 'axios';
import { Button } from '@mui/material';

const btnStyle = {
  backgroundColor: '#EF8F01',
  margin: '8px 0',
  ':hover': { backgroundColor: '#EF8F0199' },
};

interface UsersProps {}

const Users: FunctionComponent<UsersProps> = () => {
  const [uid, setUid] = useState('');
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [rowCountState, setRowCountState] = useState<number>(0);
  const [rowsState, setRowsState] = useState<GridRowsProp<User>>([]);
  const [showSuccessDeleteMessage, setShowSuccessDeleteMessage] = useState(false);

  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const queryClient = useQueryClient();
  const accessToken = user != undefined && user ? (user.accessToken as string) : sessionStorage.getItem('accessToken');

  const { isLoading, isFetching, isError, data } = useQuery<PaginatedResponseType<User>>(
    ['usersList', page, pageSize],
    () => getUsersPaginated(page, pageSize, { accessToken }),
    {
      enabled: !!accessToken,
      keepPreviousData: true,
      staleTime: 2000 * 60,
      onError: (err) => errorDispatcher(err as AxiosError<IBaseResponse>, refresh),
    },
  );

  const handleNewEntry = () => {
    navigate('/users/new');
  };

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

  const handleDeleteClick = (id: string) => {
    setConfirmDelete(true);
    setUid(id);
  };

  const handleDetailsClick = (id: string) => {
    setUid(id);
    navigate(`/users/${id}`);
  };

  useEffect(() => {
    setRowsState((prevRowsState) => (data?.records !== undefined ? data.records : prevRowsState));
  }, [data?.records, setRowsState]);

  useEffect(() => {
    setRowCountState((prevRowCountState) => (data?.count !== undefined ? data.count : prevRowCountState));
  }, [data?.count, setRowCountState]);

  const columns: GridColumns<User> = [
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
      headerAlign: 'center',
      align: 'center',
      valueOptions: [UserRoleType.ADMIN, UserRoleType.CONSUMER],
      renderCell: (params: GridRenderCellParams<any>) => (
        <span style={{ color: params.value === UserRoleType.ADMIN ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.38)' }}>
          {params.value === UserRoleType.ADMIN ? <HowToReg fontSize="small" /> : <Close fontSize="small" />}
        </span>
      ),
    },
    { field: 'createdAt', headerName: 'Data de criação', ...dateAndTimeColumnType },
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions: (params) => {
        return actionsColumnMenu({
          params,
          disabledDelete: params.row.email === user?.email,
          deleteAction: handleDeleteClick,
          detailsAction: handleDetailsClick,
        });
      },
    },
  ];

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-2 text-[#00000090]">Usuários</h1>
      <hr />
      <div className="mt-6 w-full h-[74vh]">
        <div className="flex justify-end w-full">
          <Button size="small" variant="contained" startIcon={<PersonAdd />} sx={btnStyle} onClick={handleNewEntry}>
            Nova entrada
          </Button>
        </div>
        <DataGrid
          {...dataGridBasePropsDefinitions({ isError })}
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
