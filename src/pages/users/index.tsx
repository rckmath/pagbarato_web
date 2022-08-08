import { format } from 'date-fns';
import { FunctionComponent, SyntheticEvent, useEffect, useState } from 'react';

import { DataGrid, GridRowsProp, GridColDef, ptBR, GridRenderCellParams, GridValueFormatterParams } from '@mui/x-data-grid';
import { IconButton, IconButtonProps, styled } from '@mui/material';
import { Close, DeleteRounded, HowToReg } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';

import ConfirmDialog from '../../components/ConfirmDialog';
import SnackbarAlert from '../../components/SnackbarAlert';
import DataGridOverlay from '../../components/DataGrid/DataGridOverlay';
import DataGridToolbar from '../../components/DataGrid/DataGridToolbar';
import DataGridLoading from '../../components/DataGrid/DataGridLoading';

import { api } from '../../services/api';
import { UserRoleType, UserType } from '../../services/user';
import { UserAuth } from '../../context/AuthProvider';

const ColoredIconButton = styled(IconButton)<IconButtonProps>(({ theme: any }) => ({
  '&:hover': {
    backgroundColor: '#f69f03',
  },
}));

interface UsersProps {}

const Users: FunctionComponent<UsersProps> = () => {
  const [uid, setUid] = useState('');
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [rows, setRows] = useState<GridRowsProp<UserType>>([]);
  const [rowCountState, setRowCountState] = useState<number>(count);
  const [showSuccessDeleteMessage, setShowSuccessDeleteMessage] = useState(false);

  const { user } = UserAuth();
  const localToken = sessionStorage.getItem('accessToken');

  const {
    isFetching,
    isError,
    refetch,
    data: usersList,
  } = useQuery<UserType[]>(
    ['usersList', page, pageSize],
    async () => {
      const accessToken = user?.accessToken || localToken;

      const { data: response } = await api.get(`/user?page=${page + 1}&pageSize=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setCount(response.data.count);
      return response.data.records;
    },
    {
      keepPreviousData: true,
      staleTime: 2000 * 60, // 2 minutes
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

    await api.delete(`/user/${uid}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    setShowSuccessDeleteMessage(true);
    refetch();
  };

  useEffect(() => {
    if (usersList) setRows([...usersList]);
  }, [usersList]);

  useEffect(() => {
    setRowCountState((prevRowCountState) => (count !== undefined ? count : prevRowCountState));
  }, [count, setRowCountState]);

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
    {
      field: 'createdAt',
      headerName: 'Data de criação',
      minWidth: 170,
      maxWidth: 170,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<string>) => {
        if (params.value == null) return '';
        const valueFormatted = format(new Date(params.value), 'dd/MM/yyyy HH:mm:ss');
        return valueFormatted;
      },
    },
    {
      field: 'delete',
      filterable: false,
      disableReorder: true,
      disableColumnMenu: true,
      headerName: '',
      minWidth: 64,
      maxWidth: 72,
      flex: 1,
      align: 'center',
      renderCell: (params: GridRenderCellParams<any>) => (
        <ColoredIconButton
          size="small"
          aria-label="delete"
          disabled={user?.email === params.row.email}
          onClick={() => {
            setConfirmDelete(true);
            setUid(params.id as string);
          }}
        >
          <DeleteRounded />
        </ColoredIconButton>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <h1 className="text-4xl font-bold">Usuários</h1>
      <div className="mt-8 w-full h-[74vh]">
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
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
