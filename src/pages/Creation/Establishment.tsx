import ptBRLocale from 'date-fns/locale/pt-BR';
import { AxiosError } from 'axios';
import { Chip, Divider, Grid, Paper, TextField, Tooltip, Box, MenuItem } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, FunctionComponent, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Info, Send, MyLocation, Add, Delete } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { ClickEventValue } from 'google-map-react';

import { useAuth } from '../../context/AuthProvider';
import SnackbarAlert from '../../components/SnackbarAlert';
import { createEstablishment } from '../../services/establishment';
import { ColoredIconButton } from '../../components/Buttons/ColoredIconButton';
import { ColoredLinearProgress } from '../../components/ColoredLinearProgress';
import { errorDispatcher, IBaseResponse } from '../../services/api';
import { BusinessHours, DayOfWeekType, DayOfWeekTypeMap, EstablishmentForm, MAX_BUSINESSES_HOURS } from '../../models/establishment';
import Map, { ILatLong, MapRecentralize } from '../../components/Map';
import SearchPlaceInput from '../../components/Map/SearchPlaceInput';
import { btnStyle, inputStyle } from '../../components/CommonStyles';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import IconButtonWithTooltip from '../../components/Buttons/IconButtonWithTooltip';

interface EstablishmentDetailsProps {}

const EstablishmentDetails: FunctionComponent<EstablishmentDetailsProps> = () => {
  const [mapRecentralize, setMapRecentralize] = useState<MapRecentralize>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [showCreateSuccessMessage, setShowCreateSuccessMessage] = useState(false);
  const [establishmentForm, setEstablishmentForm] = useState<EstablishmentForm>({
    name: '',
    createdAt: '',
    latitude: 0,
    longitude: 0,
    businessesHours: [{ day: DayOfWeekType.MON, openingAt: null, closureAt: null }],
  });

  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const queryClient = useQueryClient();
  const accessToken = user != undefined && user ? (user.accessToken as string) : sessionStorage.getItem('accessToken');
  const defaultCoordinates: ILatLong = {
    lat: -23.533773,
    lng: -46.62529,
    title: '',
  };

  const establishmentMutation = useMutation(
    (establishmentForm: EstablishmentForm) => createEstablishment(establishmentForm, { accessToken }),
    {
      onSuccess: ({ id }) => {
        setShowCreateSuccessMessage(true);
        queryClient.invalidateQueries(['establishmentsList']);
        setTimeout(() => {
          navigate(`/establishments/${id}`);
        }, 750);
      },
      onError: (err) => errorDispatcher(err as AxiosError<IBaseResponse>, refresh),
    },
  );

  const handleLocationSearch = (params: google.maps.places.PlaceResult) => {
    if (params.name && params.geometry?.location) {
      setMapRecentralize({ recentralize: true, zoomLevel: 17 });
      setEstablishmentForm({
        ...establishmentForm,
        name: params.name,
        latitude: params.geometry?.location?.lat(),
        longitude: params.geometry?.location?.lng(),
      });
    }
  };

  const handleGoBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/establishments', { replace: true });
    }
  };

  const handleForm = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, param: string) => {
    setEstablishmentForm({
      ...establishmentForm,
      [param]: e.target.value,
    });
  };

  const handleCoordinatesChange = (params: ClickEventValue) => {
    if (mapRecentralize.recentralize) setMapRecentralize({ ...mapRecentralize, recentralize: false });

    setEstablishmentForm({
      ...establishmentForm,
      latitude: Number(params.lat.toFixed(8)),
      longitude: Number(params.lng.toFixed(8)),
    });
  };

  const handleBusinessHoursChange = (value: any, toChangeIndex: number, param: string) => {
    const newBusinessHours = establishmentForm.businessesHours.map((x, index) => {
      if (index === toChangeIndex) return { ...x, [param]: value };
      return x;
    });

    setEstablishmentForm({ ...establishmentForm, businessesHours: newBusinessHours });
  };

  const handleNewBusinessHours = () => {
    const businessesHours: Array<BusinessHours> = [
      ...establishmentForm.businessesHours,
      { day: DayOfWeekType.MON, openingAt: null, closureAt: null },
    ];

    setEstablishmentForm({ ...establishmentForm, businessesHours: businessesHours });
  };

  const handleDeleteBusinessHours = (toDeleteIndex: number) => {
    const businessesHours = establishmentForm.businessesHours.filter((x, index) => index !== toDeleteIndex && x);
    setEstablishmentForm({ ...establishmentForm, businessesHours: businessesHours });
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await establishmentMutation.mutateAsync(establishmentForm);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleMessageClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setShowCreateSuccessMessage(false);
    setErrorMessage('');
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-3xl font-bold mb-2 text-[#00000090]">Detalhes</h1>
      <hr />
      <Paper sx={{ paddingX: '2.5rem', paddingY: '1rem', marginTop: '1.5rem', marginBottom: '1.125rem', minWidth: 400 }} elevation={2}>
        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
          <Grid container>
            <Grid item xs={12} sm={6} textAlign="left">
              <Tooltip title="Voltar para listagem" placement="top" arrow>
                <ColoredIconButton size="medium" onClick={handleGoBack} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.06)' }}>
                  <ArrowBack fontSize="small" />
                </ColoredIconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={24} sm={12}>
              <Divider>
                <Chip icon={<Info />} sx={{ color: '#00000090' }} label="DADOS DO ESTABELECIMENTO" />
              </Divider>
            </Grid>
            <Grid item xs={24} sm={12}>
              <TextField
                fullWidth
                required
                variant="outlined"
                sx={inputStyle}
                type="text"
                label="Nome"
                value={establishmentForm.name}
                placeholder="Nome do estabelecimento"
                onChange={(e) => handleForm(e, 'name')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                variant="outlined"
                sx={inputStyle}
                type="number"
                label="Latitude"
                value={establishmentForm.latitude}
                placeholder="Latitude do estabelecimento"
                onChange={(e) => handleForm(e, 'latitude')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                variant="outlined"
                sx={inputStyle}
                type="number"
                label="Longitude"
                value={establishmentForm.longitude}
                placeholder="Longitude do estabelecimento"
                onChange={(e) => handleForm(e, 'longitude')}
              />
            </Grid>
          </Grid>
          <Grid container paddingTop={3} rowGap={1}>
            <Grid item xs={12} sm={12} paddingBottom={1}>
              <Divider>
                <Chip icon={<MyLocation />} sx={{ color: '#00000090' }} label="HORÁRIO DE FUNCIONAMENTO" />
              </Divider>
            </Grid>
            {establishmentForm &&
              establishmentForm.businessesHours?.length &&
              establishmentForm.businessesHours.map((bHours, index) => {
                return (
                  <Grid container spacing={2} key={index}>
                    <Grid item xs={8} sm={4}>
                      <TextField
                        fullWidth
                        required
                        select
                        variant="outlined"
                        sx={inputStyle}
                        label="Dia da semana"
                        value={bHours.day || null}
                        placeholder="Selecione um dia da semana"
                        onChange={(e) => handleBusinessHoursChange(e.target.value, index, 'day')}
                      >
                        {DayOfWeekTypeMap.map((dayOfWeekType) => {
                          return (
                            <MenuItem
                              key={dayOfWeekType[0]}
                              value={dayOfWeekType[0]}
                              disabled={!!establishmentForm.businessesHours.find((x) => x.day === dayOfWeekType[0])}
                            >
                              {dayOfWeekType[1]}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBRLocale}>
                        <TimePicker
                          showToolbar
                          label="Horário de abertura"
                          value={bHours.openingAt}
                          onChange={(newOpening) => handleBusinessHoursChange(newOpening, index, 'openingAt')}
                          renderInput={(params) => <TextField variant="outlined" fullWidth sx={inputStyle} {...params} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBRLocale}>
                        <TimePicker
                          showToolbar
                          label="Horário de fechamento"
                          value={bHours.closureAt}
                          onChange={(newClosure) => handleBusinessHoursChange(newClosure, index, 'closureAt')}
                          renderInput={(params) => <TextField variant="outlined" fullWidth sx={inputStyle} {...params} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={2} sm={2} textAlign="left" alignSelf="center" marginTop={-1}>
                      {establishmentForm.businessesHours.length > 1 && (
                        <Grid item>
                          <IconButtonWithTooltip
                            buttonSize="small"
                            icon={<Delete fontSize="inherit" />}
                            tooltipPlacement="right"
                            tooltipTitle="Apagar horário de funcionamento"
                            action={() => handleDeleteBusinessHours(index)}
                          />
                        </Grid>
                      )}
                      {index === establishmentForm.businessesHours.length - 1 &&
                        establishmentForm.businessesHours.length < MAX_BUSINESSES_HOURS && (
                          <Grid item>
                            <IconButtonWithTooltip
                              buttonSize="small"
                              icon={<Add fontSize="inherit" />}
                              tooltipPlacement="right"
                              tooltipTitle="Novo horário de funcionamento"
                              action={handleNewBusinessHours}
                            />
                          </Grid>
                        )}
                    </Grid>
                  </Grid>
                );
              })}
          </Grid>
          <Grid container spacing={2} paddingTop={2}>
            <Grid item xs={12} sm={12}>
              <Divider>
                <Chip icon={<MyLocation />} sx={{ color: '#00000090' }} label="DEFINA A LOCALIZAÇÃO" />
              </Divider>
            </Grid>
            <Grid item xs={12} sm={12}>
              <SearchPlaceInput
                onPlaceChange={handleLocationSearch}
                placeholder="Pesquise e selecione um estabelecimento"
                helperText="Ou marque no mapa (clicando em um ponto):"
              />
              <div className="flex w-full h-[300px] align-middle justify-center">
                <Map
                  defaultCenter={defaultCoordinates}
                  defaultZoomLevel={12}
                  coordinates={{
                    lat: Number(establishmentForm.latitude),
                    lng: Number(establishmentForm.longitude),
                    title: establishmentForm.name,
                  }}
                  recentralize={mapRecentralize.recentralize}
                  zoomLevel={mapRecentralize.zoomLevel}
                  handleMapClick={handleCoordinatesChange}
                />
              </div>
            </Grid>
            <Grid item xs={24} sm={12} textAlign="right">
              <LoadingButton
                endIcon={<Send />}
                loading={establishmentMutation.isLoading}
                type="submit"
                variant="contained"
                style={btnStyle}
              >
                Salvar
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      {establishmentMutation.isLoading && <ColoredLinearProgress />}
      <SnackbarAlert
        backgroundColor="#367315"
        open={showCreateSuccessMessage}
        text="Estabelecimento criado com sucesso"
        handleClose={handleMessageClose}
      />
      <SnackbarAlert backgroundColor="#B00020" open={!!errorMessage} text={errorMessage} handleClose={handleMessageClose} />
    </div>
  );
};

export default EstablishmentDetails;
