import { ErrorRounded, FilterListOffRounded } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { FunctionComponent } from 'react';

interface DataGridOverlayProps {
  error?: boolean;
}

const DataGridOverlay: FunctionComponent<DataGridOverlayProps> = ({ error }) => {
  return (
    <Stack height="100%" alignItems="center" justifyContent="center">
      <span className="text-primary-yellow mb-2">{!error ? <FilterListOffRounded fontSize="large" /> : <ErrorRounded fontSize="large" />}</span>
      {!error ? 'Nenhum resultado encontrado' : 'Erro ao carregar informações'}
    </Stack>
  );
};

export default DataGridOverlay;
