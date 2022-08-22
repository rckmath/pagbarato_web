import { AxiosError } from 'axios';
import { Box, Chip, CircularProgress, Divider, Grid, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, FunctionComponent, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Info, Send, MyLocation } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { useAuth } from '../../context/AuthProvider';
import SnackbarAlert from '../../components/SnackbarAlert';
import { createEstablishment } from '../../services/establishment';
import { ColoredIconButton } from '../../components/Buttons/ColoredIconButton';
import { ColoredLinearProgress } from '../../components/ColoredLinearProgress';
import { errorDispatcher, IBaseResponse } from '../../services/api';
import { EstablishmentForm } from '../../models/establishment';
import Map, { ILatLong } from '../../components/Map';
import { ClickEventValue } from 'google-map-react';
import SearchPlaceInput from '../../components/Map/SearchPlaceInput';

const inputStyle = {
  paddingBottom: 1,
  '& label.Mui-focused': {
    color: '#EF8F01',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#EF8F01',
  },
  '& .MuiOutlinedInput-root.Mui-focused': {
    '& > fieldset': { borderColor: '#EF8F01' },
  },
  '& .MuiFilledInput-underline:after': {
    borderBottomColor: '#EF8F01',
  },
};

const btnStyle = { backgroundColor: '#f69f03', margin: '8px 0' };

type MapRecentralize = {
  recentralize?: boolean;
  zoomLevel?: number;
};

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

  const handleCoordinatesChange = (params: ClickEventValue) => {
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
    <div className="flex flex-col w-full">
      <h1 className="text-3xl font-bold mb-2 text-[#00000090]">Detalhes</h1>
      <hr />
      <Paper sx={{ paddingX: '2.5rem', paddingY: '1rem', marginY: '1.5rem', minWidth: 400 }} elevation={2}>
        <form onSubmit={handleSubmit}>
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
          <Grid container spacing={3} paddingTop={2}>
            <Grid item xs={12} sm={12}>
              <Divider>
                <Chip icon={<MyLocation />} sx={{ color: '#00000090' }} label="DEFINA A LOCALIZAÇÃO" />
              </Divider>
            </Grid>
            <Grid item xs={12} sm={12}>
              <SearchPlaceInput
                onPlaceChange={handleLocationSearch}
                placeholder="Pesquise e selecione a localização do estabelecimento"
                helperText="Ou marque no mapa (clicando em um ponto):"
              />
              <div className="flex w-full h-[370px] align-middle justify-center">
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
        </form>
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
