import { Delete, Edit, OpenInNew } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { GridActionsCellItem, GridActionsCellItemProps, GridColTypeDef, GridRowParams, GridValueFormatterParams } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { JSXElementConstructor, ReactElement } from 'react';
import { ColoredIconButton } from '../Buttons/ColoredIconButton';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

interface ActionsColumnMenuProps {
  deleteAction?: (param: any) => void;
  editAction?: (param: any) => void;
  params: GridRowParams<any[]>;
}

export const actionsColumnMenu = ({
  deleteAction,
  editAction,
  params,
}: ActionsColumnMenuProps): ReactElement<GridActionsCellItemProps, string | JSXElementConstructor<any>>[] => [
  <GridActionsCellItem
    label="Apagar"
    icon={<Delete fontSize="medium" />}
    onClick={() => {
      if (!params.id) return;
      deleteAction && deleteAction(params.id);
    }}
    sx={{ '&:hover': { backgroundColor: '#ef8f0130' } }}
    showInMenu
  />,
  <GridActionsCellItem
    label="Editar"
    icon={<Edit fontSize="medium" />}
    onClick={() => {
      if (!params.id) return;
      editAction && editAction(params.id);
    }}
    sx={{ '&:hover': { backgroundColor: '#ef8f0130' } }}
    showInMenu
  />,
];

export const dateAndTimeColumnType: GridColTypeDef = {
  minWidth: 170,
  maxWidth: 170,
  flex: 1,
  valueFormatter: (params: GridValueFormatterParams<string>) => {
    if (params.value == null) return '';
    return format(new Date(params.value), 'dd/MM/yyyy HH:mm:ss');
  },
};

export const priceColumnType: GridColTypeDef = {
  flex: 1,
  type: 'number',
  minWidth: 80,
  maxWidth: 100,
  cellClassName: 'font-tabular-nums',
  headerAlign: 'right',
  align: 'right',
  valueFormatter: ({ value }) => currencyFormatter.format(value),
};

interface OpenInNewTabCellProps {
  id: string;
  path: string;
  value: string;
  tooltipTitleEntity?: string;
}

export const openInNewTabCell = ({ id, value, path, tooltipTitleEntity = 'entrada' }: OpenInNewTabCellProps) => (
  <div className="flex justify-between w-full">
    <span className="table-cell self-center">{value}</span>
    <Tooltip title={`Abrir detalhes de ${tooltipTitleEntity}`} placement="left" arrow>
      <span style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
        <ColoredIconButton size="small" aria-label="openInNewTab" onClick={() => {}}>
          <OpenInNew />
        </ColoredIconButton>
      </span>
    </Tooltip>
  </div>
);
