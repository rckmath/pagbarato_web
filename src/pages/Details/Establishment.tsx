import ptBRLocale from 'date-fns/locale/pt-BR';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AxiosError } from 'axios';
import { Box, Chip, CircularProgress, Divider, Grid, MenuItem, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, FunctionComponent, SyntheticEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack, Edit, EditOff, Info, Send, MyLocation, Add, Delete, AccessTimeFilled } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { useAuth } from '../../context/AuthProvider';
import SnackbarAlert from '../../components/SnackbarAlert';
import { getEstablishmentById, updateEstablishment } from '../../services/establishment';
import { ColoredIconButton } from '../../components/Buttons/ColoredIconButton';
import { ColoredLinearProgress } from '../../components/ColoredLinearProgress';
import { api, errorDispatcher, IBaseResponse } from '../../services/api';
import {
  BusinessHours,
  DayOfWeekType,
  DayOfWeekMap,
  Establishment,
  EstablishmentForm,
  MAX_BUSINESSES_HOURS,
} from '../../models/establishment';
import Map, { ILatLong, MapRecentralize } from '../../components/Map';
import { ClickEventValue } from 'google-map-react';
import SearchPlaceInput from '../../components/Map/SearchPlaceInput';
import { btnStyle, inputStyle } from '../../components/CommonStyles';
import IconButtonWithTooltip from '../../components/Buttons/IconButtonWithTooltip';
import { set } from 'date-fns';

type TextFieldVariant = 'filled' | 'standard' | 'outlined' | undefined;

interface EstablishmentDetailsProps {}

const EstablishmentDetails: FunctionComponent<EstablishmentDetailsProps> = () => {
  const [edit, setEdit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mapRecentralize, setMapRecentralize] = useState<MapRecentralize>({});
  const [defaultCoordinates, setDefaultCoordinates] = useState<ILatLong>(null!);
  const [showUpdateSuccessMessage, setShowUpdateSuccessMessage] = useState(false);
  const [changedBusinessesHours, setChangedBusinessesHours] = useState<boolean>(false);
  const [establishmentForm, setEstablishmentForm] = useState<EstablishmentForm>({
    name: '',
    createdAt: '',
    latitude: 0,
    longitude: 0,
    businessesHours: [{ day: DayOfWeekType.MON, openingAt: null, closureAt: null }],
  });

  const params = useParams();
  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const queryClient = useQueryClient();
  const fieldVariant: TextFieldVariant = edit ? 'outlined' : 'filled';
  const accessToken = user != undefined && user ? (user.accessToken as string) : sessionStorage.getItem('accessToken');

  const { isFetching } = useQuery<Establishment>(
    ['establishment', params.id],
    () => getEstablishmentById(params.id as string, { accessToken }),
    {
      enabled: !!accessToken,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setDefaultCoordinates({ title: data.name, lat: data.latitude, lng: data.longitude });
        setEstablishmentForm({
          ...establishmentForm,
          ...data,
          ...(data.businessesHours?.length === 0 && {
            businessesHours: [{ day: DayOfWeekType.MON, openingAt: null, closureAt: null }],
          }),
        });
      },
      onError: (err) => errorDispatcher(err as AxiosError<IBaseResponse>, refresh),
    },
  );

  const establishmentMutation = useMutation(
    (establishmentForm: EstablishmentForm) => updateEstablishment(params.id as string, establishmentForm, { accessToken }),
    {
      onSuccess: () => {
        setShowUpdateSuccessMessage(true);
        queryClient.invalidateQueries(['establishmentsList']);
      },
    },
  );

  const handleLocationSearchBusinessHours = (params: google.maps.places.PlaceResult) => {
    if (!params.opening_hours) return;

    const openingHours = params.opening_hours.periods;
    const businessesHours: Array<BusinessHours> = [];

    openingHours &&
      openingHours?.forEach((x) => {
        const businessHour: BusinessHours = {
          day: DayOfWeekMap[x.open.day][0] as DayOfWeekType,
          openingAt: set(new Date(), { hours: x.open.hours, minutes: x.open.minutes, seconds: 0 }),
          closureAt: set(new Date(), { hours: x.close?.hours ?? 18, minutes: x.close?.minutes ?? 0, seconds: 0 }),
        };

        businessesHours.push(businessHour);
      });

    return businessesHours;
  };

  const handleLocationSearch = (params: google.maps.places.PlaceResult) => {
    if (params.name && params.geometry?.location) {
      const businessesHours = handleLocationSearchBusinessHours(params);
      setMapRecentralize({ recentralize: true, zoomLevel: 17 });
      setEstablishmentForm({
        ...establishmentForm,
        name: params.name,
        latitude: params.geometry?.location?.lat(),
        longitude: params.geometry?.location?.lng(),
        ...(businessesHours && businessesHours.length && { businessesHours: businessesHours as Array<BusinessHours> }),
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
      {
        day: DayOfWeekType.MON,
        openingAt: null,
        closureAt: null,
      },
    ];

    setEstablishmentForm({ ...establishmentForm, businessesHours: businessesHours });
    setChangedBusinessesHours(true);
  };

  const handleDeleteBusinessHours = async (toDeleteIndex: number) => {
    const uid = establishmentForm.businessesHours[toDeleteIndex]?.id;

    if (uid) {
      await api.delete('/establishment/' + uid, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { isBusinessesHours: true },
      });
    }

    const businessesHours = establishmentForm.businessesHours.filter((x, index) => index !== toDeleteIndex && x);

    if (!businessesHours.length) {
      businessesHours.push({
        day: DayOfWeekType.MON,
        openingAt: null,
        closureAt: null,
      });
    }

    setEstablishmentForm({ ...establishmentForm, businessesHours: businessesHours });
  };

  const handleForm = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, param: string) => {
    setEstablishmentForm({
      ...establishmentForm,
      [param]: e.target.value,
    });
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await establishmentMutation.mutateAsync(establishmentForm);

      if (changedBusinessesHours) {
        queryClient.invalidateQueries(['establishment', params.id]);
        setChangedBusinessesHours(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleMessageClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setShowUpdateSuccessMessage(false);
    setErrorMessage('');
  };

  const handleCoordinatesChange = (params: ClickEventValue) => {
    if (!edit) return;
    if (mapRecentralize.recentralize) {
      setMapRecentralize({ ...mapRecentralize, recentralize: false });
    }
    setEstablishmentForm({
      ...establishmentForm,
      latitude: Number(params.lat.toFixed(8)),
      longitude: Number(params.lng.toFixed(8)),
    });
  };

  return (
    <div className="flex flex-col w-full ">
      <h1 className="text-3xl font-semibold mb-2 text-[#0A0A0A]">Detalhes</h1>
      <hr />
      <Paper sx={{ paddingX: '2.5rem', paddingY: '1rem', marginTop: '1.5rem', marginBottom: '1.125rem', minWidth: 400 }} elevation={2}>
        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
          <Grid container>
            <Grid item xs={12} sm={6} textAlign="left">
              <Tooltip title="Voltar" placement="top" arrow>
                <ColoredIconButton size="medium" onClick={handleGoBack} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.06)' }}>
                  <ArrowBack fontSize="small" />
                </ColoredIconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} textAlign="right">
              <Tooltip title={`${edit ? 'Desabilitar' : 'Habilitar'} edição`} placement="top" arrow>
                <span>
                  <ColoredIconButton
                    disabled={isFetching}
                    size="medium"
                    onClick={() => setEdit((state) => !state)}
                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.06)' }}
                  >
                    {edit ? <Edit fontSize="small" /> : <EditOff fontSize="small" />}
                  </ColoredIconButton>
                </span>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={24} sm={12}>
              <Divider>
                <Chip icon={<Info />} sx={{ color: '#00000090' }} label="INFORMAÇÕES DO ESTABELECIMENTO" />
              </Divider>
            </Grid>
            <Grid item xs={24} sm={12}>
              <TextField
                fullWidth
                required
                variant={fieldVariant}
                sx={inputStyle}
                type="text"
                label="Nome"
                value={establishmentForm.name}
                placeholder="Nome do estabelecimento"
                onChange={(e) => handleForm(e, 'name')}
                InputProps={{ readOnly: !edit }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                variant={fieldVariant}
                sx={inputStyle}
                type="number"
                label="Latitude"
                value={establishmentForm.latitude}
                placeholder="Latitude do estabelecimento"
                onChange={(e) => handleForm(e, 'latitude')}
                InputProps={{ readOnly: !edit }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                variant={fieldVariant}
                sx={inputStyle}
                type="number"
                label="Longitude"
                value={establishmentForm.longitude}
                placeholder="Longitude do estabelecimento"
                onChange={(e) => handleForm(e, 'longitude')}
                InputProps={{ readOnly: !edit }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBRLocale}>
                <DatePicker
                  loading={isFetching}
                  label="Estabelecimento criado em"
                  value={establishmentForm.createdAt || null}
                  onChange={() => {}}
                  readOnly
                  renderInput={(params) => {
                    return <TextField sx={inputStyle} fullWidth variant="filled" {...params} />;
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBRLocale}>
                <DatePicker
                  loading={isFetching}
                  label="Última atualização em"
                  value={establishmentForm.updatedAt || null}
                  onChange={() => {}}
                  readOnly
                  renderInput={(params) => {
                    return <TextField sx={inputStyle} fullWidth variant="filled" {...params} />;
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Grid container paddingTop={3} rowGap={1}>
            <Grid item xs={12} sm={12} paddingBottom={1}>
              <Divider>
                <Chip icon={<AccessTimeFilled />} sx={{ color: '#00000090' }} label="HORÁRIO DE FUNCIONAMENTO" />
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
                        variant={fieldVariant}
                        sx={inputStyle}
                        label="Dia da semana"
                        value={bHours.day || null}
                        placeholder="Selecione um dia da semana"
                        inputProps={{ readOnly: !!bHours.id || !edit }}
                        onChange={(e) => handleBusinessHoursChange(e.target.value, index, 'day')}
                      >
                        {DayOfWeekMap.map((dayOfWeekType) => {
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
                          readOnly={!!bHours.id || !edit}
                          showToolbar
                          label="Horário de abertura"
                          value={bHours.openingAt}
                          onChange={(newOpening) => handleBusinessHoursChange(newOpening, index, 'openingAt')}
                          renderInput={(params) => <TextField variant={fieldVariant} fullWidth sx={inputStyle} {...params} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBRLocale}>
                        <TimePicker
                          readOnly={!!bHours.id || !edit}
                          showToolbar
                          label="Horário de fechamento"
                          value={bHours.closureAt}
                          onChange={(newClosure) => handleBusinessHoursChange(newClosure, index, 'closureAt')}
                          renderInput={(params) => <TextField variant={fieldVariant} fullWidth sx={inputStyle} {...params} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={2} sm={2} textAlign="left" alignSelf="center" marginTop={-1}>
                      {(establishmentForm.businessesHours.length > 1 || establishmentForm.businessesHours[0].id) && (
                        <Grid item>
                          <IconButtonWithTooltip
                            buttonSize="small"
                            icon={<Delete fontSize="inherit" />}
                            tooltipPlacement="right"
                            tooltipTitle="Apagar horário de funcionamento"
                            action={() => edit && handleDeleteBusinessHours(index)}
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
                              action={edit ? handleNewBusinessHours : () => {}}
                            />
                          </Grid>
                        )}
                    </Grid>
                  </Grid>
                );
              })}
          </Grid>
          <Grid container spacing={3} paddingTop={2}>
            <Grid item xs={12} sm={12}>
              <Divider>
                <Chip icon={<MyLocation />} sx={{ color: '#00000090' }} label="LOCALIZAÇÃO" />
              </Divider>
            </Grid>
            <Grid item xs={12} sm={12}>
              <SearchPlaceInput
                readOnly={!edit}
                variant={fieldVariant}
                onPlaceChange={handleLocationSearch}
                placeholder="Pesquise e selecione um estabelecimento"
                helperText="Ou marque no mapa (clicando em um ponto):"
              />
              <div className="flex w-full h-[300px] align-middle justify-center">
                {establishmentForm.latitude !== 0 && establishmentForm.longitude !== 0 ? (
                  <Map
                    defaultCenter={defaultCoordinates}
                    defaultZoomLevel={16}
                    coordinates={{
                      lat: Number(establishmentForm.latitude),
                      lng: Number(establishmentForm.longitude),
                      title: establishmentForm.name,
                    }}
                    recentralize={mapRecentralize.recentralize}
                    zoomLevel={mapRecentralize.zoomLevel}
                    handleMapClick={handleCoordinatesChange}
                  />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '& .MuiCircularProgress-root': {
                        color: '#fb5607',
                      },
                    }}
                  >
                    <Typography alignSelf="center" m={2}>
                      Carregando mapa...
                    </Typography>
                    <CircularProgress />
                  </Box>
                )}
              </div>
            </Grid>
            <Grid item xs={24} sm={12} textAlign="right">
              <LoadingButton
                endIcon={<Send />}
                loading={establishmentMutation.isLoading}
                disabled={!edit}
                type="submit"
                variant="contained"
                style={btnStyle}
                sx={{
                  '&.MuiLoadingButton-root': {
                    '&.Mui-disabled': { color: '#ffffff90' },
                  },
                }}
              >
                Salvar alterações
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      {(isFetching || establishmentMutation.isLoading) && <ColoredLinearProgress />}
      <SnackbarAlert
        backgroundColor="#012900"
        open={showUpdateSuccessMessage}
        text="Dados atualizados com sucesso"
        handleClose={handleMessageClose}
      />
      <SnackbarAlert backgroundColor="#B00020" open={!!errorMessage} text={errorMessage} handleClose={handleMessageClose} />
    </div>
  );
};

export default EstablishmentDetails;
