import { DataGrid, GridColumns, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FunctionComponent, SyntheticEvent, useEffect, useState } from 'react';
import { BookmarkAdd, EventAvailable, OpenInNew, Place } from '@mui/icons-material';
import { Button, Chip, Tooltip } from '@mui/material';
import { format } from 'date-fns';
import { AxiosError } from 'axios';

import { getPricesPaginated } from '../../services/price';
import { Price, PriceType, TrustingType, TrustingMap } from '../../models/price';
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
import { ProductUnitMap } from '../../models/product';
import { LargerTooltip } from '../../components/LargerTooltip';
import { newEntryBtnStyle } from '../../components/CommonStyles';

const truncate = (str: string, n: number) => (str.length > n ? `${str.substring(0, n)}…` : str);

const MAX_DESCRIPTION_LENGTH = 40;

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
      field: 'trustingFactor',
      align: 'center',
      headerName: 'Confiabilidade',
      minWidth: 115,
      maxWidth: 115,
      flex: 1,
      type: 'singleSelect',
      valueOptions: [TrustingType.VERY_LOW, TrustingType.LOW, TrustingType.NEUTRAL, TrustingType.HIGH, TrustingType.VERY_HIGH],
      renderCell: (params: GridRenderCellParams<any>) => {
        const { thumbsUp, thumbsDown } = params.row;
        const { value, color } = TrustingMap[params.value];
        const thumbsTooltipLabel = 'Avaliações positivas: ' + thumbsUp + '\nAvaliações negativas: ' + thumbsDown;

        return (
          <Tooltip title={<div style={{ whiteSpace: 'pre-line', textAlign: 'right' }}>{thumbsTooltipLabel}</div>} placement="left" arrow>
            <Chip size="small" label={value} variant="outlined" sx={{ color, borderColor: color, width: '100%', fontSize: '0.8rem' }} />
          </Tooltip>
        );
      },
    },
    {
      field: 'value',
      headerName: 'Valor',
      renderCell: (params: GridRenderCellParams<any>) => {
        const productUnit = params.row.product && ProductUnitMap.find((x) => x && x[0] === params.row.product.unit);
        const priceUnitTooltipLabel = `Preço por: ${productUnit ? `${productUnit[1]}` : '(UN) Unidade'}`;

        return (
          <Tooltip title={priceUnitTooltipLabel} arrow>
            <strong>{params.formattedValue}</strong>
          </Tooltip>
        );
      },
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
      minWidth: 340,
      maxWidth: 380,
      flex: 1,
      valueGetter: (params) => params.value?.name,
      renderCell: (params: GridRenderCellParams<any>) => {
        let renderValue = params.value;

        if (params.value?.length > MAX_DESCRIPTION_LENGTH) {
          const formattedValue = truncate(params.value, MAX_DESCRIPTION_LENGTH);

          renderValue = (
            <LargerTooltip title={params.value} arrow>
              <span>{formattedValue}</span>
            </LargerTooltip>
          );
        }

        return textWithButtonCell({
          value: renderValue,
          childrenButtons: (
            <>
              <IconButtonWithTooltip
                buttonSize="small"
                icon={<OpenInNew fontSize="inherit" />}
                tooltipPlacement="left"
                tooltipTitle="Abrir detalhes de produtos"
                action={() => {
                  params.row.product && handleDetailsClick(params.row.product?.id, 'products');
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
      minWidth: 380,
      flex: 1,
      valueGetter: (params) => params.value?.name,
      renderCell: (params: GridRenderCellParams<any>) => {
        let renderValue = params.value || 'Estabelecimento apagado';

        if (params.value && params.value.length > MAX_DESCRIPTION_LENGTH) {
          const formattedValue = truncate(params.value, MAX_DESCRIPTION_LENGTH);

          renderValue = (
            <LargerTooltip title={params.value} arrow>
              <span>{formattedValue}</span>
            </LargerTooltip>
          );
        }

        return textWithButtonCell({
          value: renderValue,
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
      minWidth: 190,
      maxWidth: 210,
      flex: 1,
      valueGetter: (params) => {
        const splittedName = params.value?.name.split(' ');
        return splittedName ? splittedName[0] + (splittedName[1] ? ` ${splittedName[1]}` : '') : 'Usuário apagado';
      },
      renderCell: (params: GridRenderCellParams<any>) => {
        return textWithButtonCell({
          value: params?.value,
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
      minWidth: 90,
      maxWidth: 90,
      headerName: 'Produto a vencer?',
      flex: 1,
    },
    { field: 'createdAt', headerName: 'Publicado em', ...dateAndTimeColumnType },
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions: (params) => actionsColumnMenu({ params, deleteAction: handleDeleteClick, detailsAction: handleDetailsClick }),
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex flex-col flex-1">
        <h1 className="text-3xl font-semibold mb-2 text-[#0A0A0A]">Preços</h1>
        <div className="h-1 w-10 mr-2 bg-main-orange"></div>
      </div>
      <div className="w-full h-[74vh]">
        <div className="flex justify-end w-full">
          <Button size="small" variant="contained" startIcon={<BookmarkAdd />} sx={newEntryBtnStyle} onClick={handleNewEntry}>
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
        backgroundColor="#012900"
        open={showSuccessDeleteMessage}
        text="Preço excluído com sucesso!"
        handleClose={handleSuccessDeleteClose}
      />
    </div>
  );
};

export default Prices;
