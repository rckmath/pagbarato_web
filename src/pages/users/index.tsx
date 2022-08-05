import { FunctionComponent } from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import DataGridToolbar from '../../components/DataGridToolbar';

const rows: GridRowsProp = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
  { id: 4, col1: 'MUI1', col2: 'is Amazing' },
  { id: 5, col1: 'MUI2', col2: 'is Amazing' },
  { id: 6, col1: 'MUI3', col2: 'is Amazing' },
  { id: 7, col1: 'MUI4', col2: 'is Amazing' },
  { id: 8, col1: 'MUI5', col2: 'is Amazing' },
  { id: 9, col1: 'MUI6', col2: 'is Amazing' },
  { id: 10, col1: 'MUI7', col2: 'is Amazing' },
  { id: 11, col1: 'MUI8', col2: 'is Amazing' },
  { id: 12, col1: 'MUI9', col2: 'is Amazing' },
];

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Column 1', width: 250 },
  { field: 'col2', headerName: 'Column 2', width: 250 },
];

interface UsersProps {}

const Users: FunctionComponent<UsersProps> = () => {
  return (
    <div className="flex flex-col">
      <h1 className="text-4xl font-bold">Usuários</h1>
      <div className="mt-8 w-full h-[68vh]">
        <DataGrid
          rows={rows}
          columns={columns}
          autoPageSize
          checkboxSelection
          disableSelectionOnClick
          rowsPerPageOptions={[10, 20, 30]}
          components={{ Toolbar: DataGridToolbar }}
        />
      </div>
    </div>
  );
};

export default Users;
