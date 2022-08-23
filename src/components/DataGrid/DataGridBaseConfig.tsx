import { DataGridProps, ptBR } from '@mui/x-data-grid';
import DataGridLoading from './DataGridLoading';
import DataGridOverlay from './DataGridOverlay';
import DataGridToolbar from './DataGridToolbar';

interface DataGridBasePropsDefinitionsProps {
  isError: boolean;
}

export const dataGridBasePropsDefinitions = ({ isError }: DataGridBasePropsDefinitionsProps): Partial<DataGridProps> => ({
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
    boxShadow: 1,
    minHeight: '44.5vh',
    maxHeight: '80vh',
    borderRadius: 2,
    '& .MuiCircularProgress-root': {
      color: '#f69f03',
    },
    '& .MuiCheckbox-root.Mui-checked': {
      color: '#ef8f01',
    },
    '& .MuiDataGrid-cell:hover': {
      color: '#f69f03',
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: '#f69f0330',
    },
  },
  components: {
    Toolbar: DataGridToolbar,
    LoadingOverlay: DataGridLoading,
    NoRowsOverlay: () => <DataGridOverlay error={isError} />,
  },
  localeText: ptBR.components.MuiDataGrid.defaultProps.localeText,
});
