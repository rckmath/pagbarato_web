import { GridColTypeDef, GridRenderCellParams, GridValueFormatterParams } from '@mui/x-data-grid';
import { format } from 'date-fns';

import DeleteButton from '../Buttons/DeleteButton';

interface DeleteColumnTypeProps {
  toNotDeleteCompareValue?: any;
  toNotDeleteCompareProp?: string;
  action: (idToDelete?: string) => void;
}

export const deleteColumnType = ({ toNotDeleteCompareValue, toNotDeleteCompareProp, action }: DeleteColumnTypeProps): GridColTypeDef => {
  return {
    flex: 1,
    headerName: '',
    sortable: false,
    filterable: false,
    disableReorder: true,
    disableColumnMenu: true,
    minWidth: 64,
    maxWidth: 72,
    align: 'center',
    renderCell: (params: GridRenderCellParams<any>) => (
      <DeleteButton
        idToDelete={params.id as string}
        disabled={toNotDeleteCompareValue && toNotDeleteCompareValue === params.row[`${toNotDeleteCompareProp}`]}
        action={action}
      />
    ),
  };
};

export const createdAtColumnType: GridColTypeDef = {
  headerName: 'Data de criação',
  minWidth: 170,
  maxWidth: 170,
  flex: 1,
  valueFormatter: (params: GridValueFormatterParams<string>) => {
    if (params.value == null) return '';
    return format(new Date(params.value), 'dd/MM/yyyy HH:mm:ss');
  },
};
