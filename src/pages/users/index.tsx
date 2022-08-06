import { format } from 'date-fns';
import { FunctionComponent, useState } from 'react';
import { DataGrid, GridRowsProp, GridColDef, ptBR, GridRenderCellParams } from '@mui/x-data-grid';

import DataGridToolbar from '../../components/DataGrid/DataGridToolbar';
import DataGridLoading from '../../components/DataGrid/DataGridLoading';
import { IconButton, IconButtonProps, styled } from '@mui/material';
import { DeleteRounded } from '@mui/icons-material';
import ConfirmDialog from '../../components/ConfirmDialog';

const rows: GridRowsProp = [
  {
    id: '22e01800-0553-48de-bd74-bd2efe0ba127',
    name: 'Erick',
    email: 'daniel_melo@yahoo.com',
    role: 'ADMIN',
    createdAt: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
  },
  {
    id: '8c1182ad-7e29-4202-a920-c8048cdbd2ba',
    name: 'Gago',
    email: 'arthur.silva@live.com',
    role: 'CONSUMER',
    createdAt: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
  },
  {
    id: '5458cad4-de5b-4bc7-a732-ec11c39da518',
    name: 'Nicholas ou Nícolas n sei',
    email: 'isabelly.souza@gmail.com',
    role: 'CONSUMER',
    createdAt: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
  },
  {
    id: 'b1d98cde-976a-4d08-9c2c-9932e243ed7e',
    name: 'Davi',
    email: 'vitoria.albuquerque@hotmail.com',
    role: 'ADMIN',
    createdAt: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
  },
  {
    id: '74dfaa52-63a6-4339-afbe-1f9c2a374305',
    name: 'Outro cara',
    email: 'rafael.batista@gmail.com',
    role: 'CONSUMER',
    createdAt: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
  },
  {
    id: 'd61347b5-f4df-4c0e-bc96-34b0210f4c34',
    name: 'William',
    email: 'celia.franco6@hotmail.com',
    role: 'CONSUMER',
    createdAt: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
  },
  {
    id: 'a505c0e1-5720-4c0f-b323-e06bd722e7f7',
    name: 'Benjamin',
    email: 'manuela_martins@live.com',
    role: 'CONSUMER',
    createdAt: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
  },
  {
    id: '0261fe5b-7701-46fd-ab70-24dcf17b80f9',
    name: 'Lucas	Mia',
    email: 'felipe45@gmail.com',
    role: 'CONSUMER',
    createdAt: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
  },
  {
    id: 'f1f40e7b-6b8e-4d8d-b124-9535efbe2976',
    name: 'Henry	Evelyn',
    email: 'enzogabriel.reis@live.com',
    role: 'CONSUMER',
    createdAt: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
  },
  {
    id: '9a05bfcf-0039-46fc-bb52-aa5aa6ccbe3a',
    name: 'Theodore',
    email: 'henrique.xavier@yahoo.com',
    role: 'CONSUMER',
    createdAt: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
  },
  {
    id: 'cb23797b-5787-4398-9dfd-5fe934dc6115',
    name: 'Emma',
    email: 'rafaela.carvalho@gmail.com',
    role: 'ADMIN',
    createdAt: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
  },
  {
    id: 'eb768d71-0f7c-4282-b9da-503924d2d536',
    name: 'Olivia',
    email: 'felix.batista43@gmail.com',
    role: 'ADMIN',
    createdAt: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
  },
];

const ColoredIconButton = styled(IconButton)<IconButtonProps>(({ theme: any }) => ({
  '&:hover': {
    backgroundColor: '#f69f03',
  },
}));

interface UsersProps {}

const Users: FunctionComponent<UsersProps> = () => {
  const [pageSize, setPageSize] = useState(10);
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'UID', hide: true, flex: 1 },
    { field: 'name', headerName: 'Nome', minWidth: 100, flex: 1 },
    { field: 'email', headerName: 'E-mail', minWidth: 200, flex: 1 },
    { field: 'role', headerName: 'Permissão', minWidth: 120, flex: 1 },
    { field: 'createdAt', headerName: 'Criado em', minWidth: 170, flex: 1 },
    {
      field: 'delete',
      headerName: '',
      minWidth: 64,
      maxWidth: 72,
      flex: 1,
      align: 'center',
      renderCell: (params: GridRenderCellParams<any>) => (
        <ColoredIconButton
          size="small"
          aria-label="delete"
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
          checkboxSelection
          disableSelectionOnClick
          rows={rows}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[10, 15, 20, 30]}
          loading={loading}
          onPageSizeChange={(pageSize, _details) => {
            setPageSize(pageSize);
          }}
          sx={{
            minHeight: '44.5vh',
            maxHeight: '80vh',
            borderRadius: 2,
            '.Mui-checked': {
              color: '#ef8f01',
            },
          }}
          components={{
            Toolbar: DataGridToolbar,
            LoadingOverlay: DataGridLoading,
          }}
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        />
      </div>
      <ConfirmDialog
        title="Confirmar ação"
        content={`Deseja mesmo apagar o usuário selecionado?`}
        openDialog={confirmDelete}
        confirmAction={(confirm = false) => {
          console.log({ confirm });
          setConfirmDelete(false);
        }}
      />
    </div>
  );
};

export default Users;
