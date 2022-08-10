import { DataGridProps, ptBR } from '@mui/x-data-grid';
import DataGridLoading from './DataGridLoading';
import DataGridOverlay from './DataGridOverlay';
import DataGridToolbar from './DataGridToolbar';

interface DataGridBasePropDefinitionsTypeProps {
  isError: boolean;
}

export const dataGridBasePropDefinitions = ({ isError }: DataGridBasePropDefinitionsTypeProps): Partial<DataGridProps> => ({
  disableSelectionOnClick: true,
  pagination: true,
  paginationMode: 'server',
  rowsPerPageOptions: [10, 15, 20, 30],
  initialState: {
    sorting: {
      sortModel: [{ field: 'createdAt', sort: 'desc' }],
    },
  },
  sx: {
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
  },
  components: {
    Toolbar: DataGridToolbar,
    LoadingOverlay: DataGridLoading,
    NoRowsOverlay: () => <DataGridOverlay error={isError} />,
  },
  localeText: ptBR.components.MuiDataGrid.defaultProps.localeText,
});
