import { GridToolbarContainer, GridToolbarDensitySelector, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { FunctionComponent } from 'react';

interface DataGridToolbarProps {}

const DataGridToolbar: FunctionComponent<DataGridToolbarProps> = () => {
  return (
    <GridToolbarContainer sx={{ backgroundColor: '#367315', borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
      <GridToolbarQuickFilter
        debounceMs={500}
        color="success"
        InputProps={{
          placeholder: 'Buscar por...',
          sx: {
            color: '#fff',
            '&.Mui-focused': {
              backgroundColor: '#ffffff20',
            },
          },
        }}
      />
      <GridToolbarDensitySelector sx={{ color: '#fff' }} />
    </GridToolbarContainer>
  );
};

export default DataGridToolbar;
