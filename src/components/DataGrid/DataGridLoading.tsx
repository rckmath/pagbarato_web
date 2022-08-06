import { GridLoadingOverlay } from '@mui/x-data-grid';
import { FunctionComponent } from 'react';

interface DataGridLoadingProps {}

const DataGridLoading: FunctionComponent<DataGridLoadingProps> = () => {
  return <GridLoadingOverlay sx={{ backgroundColor: '#ffffff80' }} />;
};

export default DataGridLoading;
