import { GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { FunctionComponent } from 'react';

interface DataTableToolbarFilterProps {}

const DataGridToolbar: FunctionComponent<DataTableToolbarFilterProps> = () => {
  return (
    <GridToolbarContainer sx={{ backgroundColor: 'rgb(229 231 235)' }}>
      <GridToolbarQuickFilter color="success" />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

export default DataGridToolbar;
