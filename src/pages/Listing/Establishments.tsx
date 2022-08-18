import { DataGrid, GridActionsCellItem, GridColumns, GridRowsProp } from '@mui/x-data-grid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FunctionComponent, SyntheticEvent, useEffect, useState } from 'react';
import { Delete, Place, ReadMore } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

import { useAuth } from '../../context/AuthProvider';
import { Establishment } from '../../models/establishment';
import { api, errorDispatcher, IBaseResponse, PaginatedResponseType } from '../../services/api';
import { getEstablishments } from '../../services/establishment';

import { ILatLong } from '../../components/Map';
import MapWidget from '../../components/Map/MapWidget';
import SnackbarAlert from '../../components/SnackbarAlert';
import ConfirmDialog from '../../components/ConfirmDialog';
import { dateAndTimeColumnType } from '../../components/DataGrid/DataGridCustomColumns';
import { dataGridBasePropsDefinitions } from '../../components/DataGrid/DataGridBaseConfig';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface EstablishmentsProps {}

const Establishments: FunctionComponent<EstablishmentsProps> = () => {
  const [uid, setUid] = useState('');
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [rowCountState, setRowCountState] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [coordinates, setCoordinates] = useState<null | ILatLong>(null);
  const [rowsState, setRowsState] = useState<GridRowsProp<Establishment>>([]);
  const [showSuccessDeleteMessage, setShowSuccessDeleteMessage] = useState(false);

  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const queryClient = useQueryClient();
  const mapWidgetOpen = Boolean(anchorEl) && Boolean(coordinates);
  const mapWidgetId = mapWidgetOpen ? 'establishment-list-map-widget' : undefined;
  const accessToken = user != undefined && user ? (user.accessToken as string) : sessionStorage.getItem('accessToken');

  const { isLoading, isFetching, isError, data } = useQuery<PaginatedResponseType<Establishment>>(
    ['establishmentsList', page, pageSize],
    () => getEstablishments(page, pageSize, { accessToken }),
    {
      enabled: !!accessToken,
      keepPreviousData: true,
      staleTime: 3500 * 60,
      onError: (err) => errorDispatcher(err as AxiosError<IBaseResponse>, refresh),
    },
  );

  const handleSuccessDeleteClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setShowSuccessDeleteMessage(false);
  };

  const handleDelete = async (confirm = false) => {
    setConfirmDelete(false);
    if (!confirm) return;
    await api.delete('/establishment/' + uid, { headers: { Authorization: `Bearer ${accessToken}` } });
    queryClient.invalidateQueries(['establishmentsList']);
    setShowSuccessDeleteMessage(true);
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete(true);
    setUid(id);
  };

  const handleDetailsClick = (id: string) => {
    setUid(id);
    navigate(`/establishments/${id}`);
  };

  useEffect(() => {
    setRowsState((prevRowsState) => (data?.records !== undefined ? data.records : prevRowsState));
  }, [data?.records, setRowsState]);

  useEffect(() => {
    setRowCountState((prevRowCountState) => (data?.count !== undefined ? data.count : prevRowCountState));
  }, [data?.count, setRowCountState]);

  const columns: GridColumns<Establishment> = [
    { field: 'id', headerName: 'UID', hide: true, flex: 1 },
    { field: 'name', headerName: 'Nome', minWidth: 250, flex: 1 },
    { field: 'latitude', headerName: 'Latitude', minWidth: 100, maxWidth: 200, flex: 1 },
    { field: 'longitude', headerName: 'Longitude', minWidth: 100, maxWidth: 200, flex: 1 },
    { field: 'createdAt', headerName: 'Data de criação', ...dateAndTimeColumnType },
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          label="Visualizar no mapa"
          icon={
            <Tooltip title="Visualizar no mapa" placement="left" arrow>
              <Place fontSize="inherit" />
            </Tooltip>
          }
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            if (params.row?.latitude && params.row?.longitude) {
              setAnchorEl(anchorEl ? null : event.currentTarget);
              setCoordinates({
                title: params.row.name,
                lat: params.row.latitude,
                lng: params.row.longitude,
              });
            }
          }}
          sx={{ '&:hover': { backgroundColor: '#f69f03' } }}
        />,
        <GridActionsCellItem
          label="Detalhes e edição"
          icon={<ReadMore fontSize="medium" />}
          onClick={() => handleDetailsClick(params.id as string)}
          sx={{ '&:hover': { backgroundColor: '#ef8f0130' } }}
          showInMenu
        />,
        <GridActionsCellItem
          label="Apagar"
          icon={<Delete fontSize="medium" />}
          onClick={() => handleDeleteClick(params.id as string)}
          sx={{ '&:hover': { backgroundColor: '#ef8f0130' } }}
          showInMenu
        />,
      ],
    },
  ];

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-2 text-[#00000090]">Estabelecimentos</h1>
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
          onCellClick={() => anchorEl && setAnchorEl(null)}
        />
        {coordinates && <MapWidget id={mapWidgetId} coordinates={coordinates} open={mapWidgetOpen} anchorEl={anchorEl} setAnchorEl={setAnchorEl}/>}
      </div>
      <ConfirmDialog
        title="Confirmar ação"
        content={`Deseja mesmo apagar o estabelecimento selecionado?`}
        openDialog={confirmDelete}
        confirmAction={handleDelete}
      />
      <SnackbarAlert
        backgroundColor="#367315"
        open={showSuccessDeleteMessage}
        text="Estabelecimento excluído com sucesso!"
        handleClose={handleSuccessDeleteClose}
      />
    </div>
  );
};

export default Establishments;
