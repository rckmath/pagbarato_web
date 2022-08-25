import { DataGrid, GridColumns, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FunctionComponent, SyntheticEvent, useEffect, useState } from 'react';
import { BookmarkAdd, EventAvailable, OpenInNew, Place } from '@mui/icons-material';
import { Button, Tooltip } from '@mui/material';
import { format } from 'date-fns';
import { AxiosError } from 'axios';

import { getPricesPaginated } from '../../services/price';
import { Price, PriceType } from '../../models/price';
import { useAuth } from '../../context/AuthProvider';
import { api, errorDispatcher, IBaseResponse, PaginatedResponseType } from '../../services/api';

import SnackbarAlert from '../../components/SnackbarAlert';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  actionsColumnMenu,
  dateAndTimeColumnType,
  textWithButtonCell,
  priceColumnType,
} from '../../components/DataGrid/DataGridCustomColumns';
import { dataGridBasePropsDefinitions } from '../../components/DataGrid/DataGridBaseConfig';
import IconButtonWithTooltip from '../../components/Buttons/IconButtonWithTooltip';
import { ILatLong } from '../../components/Map';
import MapWidget from '../../components/Map/MapWidget';
import { useNavigate } from 'react-router-dom';

const btnStyle = {
  backgroundColor: '#f69f03',
  margin: '8px 0',
  ':hover': { backgroundColor: '#f69f0399' },
};

interface PricesProps {}

const Prices: FunctionComponent<PricesProps> = () => {
  const [uid, setUid] = useState('');
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [rowCountState, setRowCountState] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [rowsState, setRowsState] = useState<GridRowsProp<Price>>([]);
  const [coordinates, setCoordinates] = useState<null | ILatLong>(null);
  const [showSuccessDeleteMessage, setShowSuccessDeleteMessage] = useState(false);

  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const queryClient = useQueryClient();
  const mapWidgetOpen = Boolean(anchorEl) && Boolean(coordinates);
  const mapWidgetId = mapWidgetOpen ? 'price-list-map-widget' : undefined;
  const accessToken = user != undefined && user ? (user.accessToken as string) : sessionStorage.getItem('accessToken');

  const { isLoading, isFetching, isError, data } = useQuery<PaginatedResponseType<Price>>(
    ['pricesList', page, pageSize],
    () => getPricesPaginated(page, pageSize, { accessToken }),
    {
      enabled: !!accessToken,
      keepPreviousData: true,
      staleTime: 1000 * 60,
      onError: (err) => errorDispatcher(err as AxiosError<IBaseResponse>, refresh),
    },
  );

  const handleNewEntry = () => {
    navigate('/prices/new');
  };

  const handleDetailsClick = (id: string, entity: string = 'prices') => {
    navigate(`/${entity}/${id}`);
  };

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

  const columns: GridColumns<Price> = [
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
      minWidth: 86,
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
      minWidth: 330,
      maxWidth: 360,
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
                action={() => {
                  handleDetailsClick(params.row.product?.id, 'products');
                }}
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
                tooltipTitle="Visualizar no mapa"
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
                action={() => {
                  handleDetailsClick(params.row.establishment?.id, 'establishments');
                }}
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
                action={() => {
                  handleDetailsClick(params.row.user?.id, 'users');
                }}
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
      getActions: (params) => actionsColumnMenu({ params, deleteAction: handleDeleteClick, detailsAction: handleDetailsClick }),
    },
  ];

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-2 text-[#00000090]">Preços</h1>
      <hr />
      <div className="w-full h-[74vh]">
        <div className="flex justify-end w-full">
          <Button size="small" variant="contained" startIcon={<BookmarkAdd />} sx={btnStyle} onClick={handleNewEntry}>
            Nova entrada
          </Button>
        </div>
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
          onCellClick={() => anchorEl && setAnchorEl(null)}
        />
        {coordinates && (
          <MapWidget id={mapWidgetId} coordinates={coordinates} open={mapWidgetOpen} anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
        )}
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
