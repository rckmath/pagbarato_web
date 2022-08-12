import { DataGrid, GridColumns, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FunctionComponent, MouseEvent, SyntheticEvent, useEffect, useState } from 'react';
import { EventAvailable, OpenInNew, Place } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { format } from 'date-fns';
import { AxiosError } from 'axios';

import { getPrices } from '../services/price';
import { Price, PriceType } from '../models/price';
import { useAuth } from '../context/AuthProvider';
import { api, errorDispatcher, IBaseResponse, PaginatedResponseType } from '../services/api';

import SnackbarAlert from '../components/SnackbarAlert';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  actionsColumnMenu,
  dateAndTimeColumnType,
  textWithButtonCell,
  priceColumnType,
} from '../components/DataGrid/DataGridCustomColumns';
import { dataGridBasePropsDefinitions } from '../components/DataGrid/DataGridBaseConfig';
import IconButtonWithTooltip from '../components/Buttons/IconButtonWithTooltip';
import { ILatLong } from '../components/Map';
import MapWidget from '../components/Map/MapWidget';

interface PricesProps {}

const Prices: FunctionComponent<PricesProps> = () => {
  const [uid, setUid] = useState('');
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [rowsState, setRowsState] = useState<GridRowsProp<Price>>([]);
  const [rowCountState, setRowCountState] = useState<number>(0);
  const [showSuccessDeleteMessage, setShowSuccessDeleteMessage] = useState(false);
  const [coordinates, setCoordinates] = useState<null | ILatLong>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const mapWidgetOpen = Boolean(anchorEl) && Boolean(coordinates);
  const mapWidgetId = mapWidgetOpen ? 'map-widget' : undefined;
  const { user } = useAuth();
  const accessToken = user?.accessToken || sessionStorage.getItem('accessToken');
  const queryClient = useQueryClient();

  const { isLoading, isFetching, isError, data } = useQuery<PaginatedResponseType<Price>>(
    ['pricesList', page, pageSize],
    () => getPrices(page, pageSize, { accessToken }),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60,
      onError: (err) => errorDispatcher(err as AxiosError<IBaseResponse>, user),
    },
  );

  const handleSuccessDeleteClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setShowSuccessDeleteMessage(false);
  };

  const handleDelete = async (confirm = false) => {
    setConfirmDelete(false);
    if (!confirm) return;
    await api.delete('/price/' + uid, { headers: { Authorization: `Bearer ${accessToken}` } });
    queryClient.invalidateQueries(['pricesList']);
    setShowSuccessDeleteMessage(true);
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete(true);
    setUid(id);
  };

  useEffect(() => {
    setRowsState((prevRowsState) => (data?.records !== undefined ? data.records : prevRowsState));
  }, [data?.records, setRowsState]);

  useEffect(() => {
    setRowCountState((prevRowCountState) => (data?.count !== undefined ? data.count : prevRowCountState));
  }, [data?.count, setRowCountState]);

  const columns: GridColumns<Array<Price>> = [
    { field: 'id', headerName: 'UID', hide: true, flex: 1 },
    {
      field: 'value',
      headerName: 'Valor',
      renderCell: (params: GridRenderCellParams<any>) => <strong>{params.formattedValue}</strong>,
      ...priceColumnType,
    },
    {
      field: 'type',
      headerName: 'Tipo',
      minWidth: 72,
      maxWidth: 86,
      flex: 1,
      type: 'singleSelect',
      valueOptions: [PriceType.COMMON, PriceType.DEAL],
      renderCell: (params: GridRenderCellParams<any>) => {
        const isDeal = params.value === PriceType.DEAL;
        const expiresAtTooltipLabel =
          'Validade da oferta: ' + (params.row.expiresAt ? `${format(new Date(params.row.expiresAt), 'dd/MM/yyyy')}` : 'não informada');

        return (
          <span>
            {params.value === PriceType.DEAL ? 'Oferta' : 'Comum'}
            {isDeal && (
              <span style={{ color: 'rgba(0, 0, 0, 0.6)', marginLeft: 8 }}>
                <Tooltip title={expiresAtTooltipLabel} arrow>
                  <EventAvailable fontSize="small" />
                </Tooltip>
              </span>
            )}
          </span>
        );
      },
    },
    {
      field: 'product',
      headerName: 'Produto',
      minWidth: 280,
      maxWidth: 320,
      flex: 1,
      valueGetter: (params) => params.value?.name,
      renderCell: (params: GridRenderCellParams<any>) => {
        return textWithButtonCell({
          value: params.value,
          childrenButtons: (
            <>
              <IconButtonWithTooltip
                buttonSize="small"
                icon={<OpenInNew fontSize="inherit" />}
                tooltipPlacement="left"
                tooltipTitle="Abrir detalhes de produtos"
                action={() => {}}
              />
            </>
          ),
        });
      },
    },
    {
      field: 'establishment',
      headerName: 'Estabelecimento',
      minWidth: 350,
      flex: 1,
      valueGetter: (params) => params.value?.name,
      renderCell: (params: GridRenderCellParams<any>) => {
        return textWithButtonCell({
          value: params.value,
          childrenButtons: (
            <>
              <IconButtonWithTooltip
                buttonSize="small"
                icon={<Place fontSize="inherit" />}
                tooltipPlacement="left"
                tooltipTitle="Visualizar mapa"
                action={(event: React.MouseEvent<HTMLElement>) => {
                  if (params.row.establishment?.latitude && params.row.establishment?.longitude) {
                    setAnchorEl(anchorEl ? null : event.currentTarget);
                    setCoordinates({
                      title: params.value,
                      lat: params.row.establishment.latitude,
                      lng: params.row.establishment.longitude,
                    });
                  }
                }}
              />
              <IconButtonWithTooltip
                buttonSize="small"
                icon={<OpenInNew fontSize="inherit" />}
                tooltipPlacement="left"
                tooltipTitle="Abrir detalhes de estabelecimentos"
                action={() => {}}
              />
            </>
          ),
        });
      },
    },
    {
      field: 'user',
      headerName: 'Criado por',
      minWidth: 200,
      maxWidth: 230,
      flex: 1,
      valueGetter: (params) => {
        const splittedName = params.value?.name.split(' ');
        return splittedName && splittedName[0] + (splittedName[1] ? ` ${splittedName[1]}` : '');
      },
      renderCell: (params: GridRenderCellParams<any>) => {
        return textWithButtonCell({
          value: params.value,
          childrenButtons: (
            <>
              <IconButtonWithTooltip
                buttonSize="small"
                icon={<OpenInNew fontSize="inherit" />}
                tooltipPlacement="left"
                tooltipTitle="Abrir detalhes de usuários"
                action={() => {}}
              />
            </>
          ),
        });
      },
    },
    {
      field: 'isProductWithNearExpirationDate',
      type: 'boolean',
      minWidth: 160,
      maxWidth: 160,
      headerName: 'Produto a vencer?',
      flex: 1,
    },
    { field: 'expiresAt', headerName: 'Data de validade', hide: true, ...dateAndTimeColumnType },
    { field: 'createdAt', headerName: 'Data de publicação', ...dateAndTimeColumnType },
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions: (params) => actionsColumnMenu({ params, deleteAction: handleDeleteClick }),
    },
  ];

  return (
    <div className="flex flex-col">
      <h1 className="text-4xl font-bold mb-2">Preços</h1>
      <hr />
      <div className="mt-6 w-full h-[74vh]">
        <DataGrid
          {...dataGridBasePropsDefinitions({ isError })}
          rows={rowsState}
          columns={columns}
          rowCount={rowCountState}
          page={page}
          pageSize={pageSize}
          loading={isLoading || isFetching}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(pageSize) => setPageSize(pageSize)}
        />
        {coordinates && <MapWidget id={mapWidgetId} coordinates={coordinates} open={mapWidgetOpen} anchorEl={anchorEl} />}
      </div>
      <ConfirmDialog
        title="Confirmar ação"
        content={`Deseja mesmo apagar o preço selecionado?`}
        openDialog={confirmDelete}
        confirmAction={handleDelete}
      />
      <SnackbarAlert
        backgroundColor="#367315"
        open={showSuccessDeleteMessage}
        text="Preço excluído com sucesso!"
        handleClose={handleSuccessDeleteClose}
      />
    </div>
  );
};

export default Prices;
