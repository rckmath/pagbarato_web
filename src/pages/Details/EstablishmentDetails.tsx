import { AxiosError } from 'axios';
import { Box, Chip, CircularProgress, Divider, Grid, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, FunctionComponent, SyntheticEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack, Edit, EditOff, Info, Send, MyLocation } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { useAuth } from '../../context/AuthProvider';
import SnackbarAlert from '../../components/SnackbarAlert';
import { getEstablishmentById, updateEstablishment } from '../../services/establishment';
import { ColoredIconButton } from '../../components/Buttons/ColoredIconButton';
import { ColoredLinearProgress } from '../../components/ColoredLinearProgress';
import { errorDispatcher, IBaseResponse } from '../../services/api';
import { Establishment, EstablishmentForm } from '../../models/establishment';
import Map, { ILatLong } from '../../components/Map';
import { ClickEventValue } from 'google-map-react';

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

type TextFieldVariant = 'filled' | 'standard' | 'outlined' | undefined;

interface UserDetailsProps {}

const UserDetails: FunctionComponent<UserDetailsProps> = () => {
  const [edit, setEdit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showUpdateSuccessMessage, setShowUpdateSuccessMessage] = useState(false);
  const [defaultCoordinates, setDefaultCoordinates] = useState<ILatLong>(null!);
  const [establishmentForm, setEstablishmentForm] = useState<EstablishmentForm>({
    name: '',
    latitude: 0,
    longitude: 0,
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
        setDefaultCoordinates({
          title: data.name,
          lat: data.latitude,
          lng: data.longitude,
        });
        setEstablishmentForm({ ...establishmentForm, ...data });
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
    setShowUpdateSuccessMessage(false);
    setErrorMessage('');
  };

  const handleCoordinatesChange = (params: ClickEventValue) => {
    if (!edit) return;
    setEstablishmentForm({
      ...establishmentForm,
      latitude: Number(params.lat.toFixed(8)),
      longitude: Number(params.lng.toFixed(8)),
    });
  };

  return (
    <div className="flex flex-col w-full ">
      <h1 className="text-3xl font-bold mb-2 text-[#00000090]">Detalhes</h1>
      <hr />
      <Paper sx={{ paddingX: '2.5rem', paddingY: '1rem', marginTop: '1.5rem', minWidth: 400 }} elevation={2}>
        <form onSubmit={handleSubmit}>
          <Grid container>
            <Grid item xs={12} sm={6} textAlign="left">
              <Tooltip title="Voltar para listagem" placement="top" arrow>
                <ColoredIconButton size="medium" onClick={handleGoBack} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.06)' }}>
                  <ArrowBack fontSize="small" />
                </ColoredIconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} textAlign="right">
              <Tooltip title={`${edit ? 'Desabilitar' : 'Habilitar'} edição`} placement="top" arrow>
                <ColoredIconButton size="medium" onClick={() => setEdit((state) => !state)} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.06)' }}>
                  {edit ? <Edit fontSize="small" /> : <EditOff fontSize="small" />}
                </ColoredIconButton>
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
                id="name"
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
                id="latitude"
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
                id="longitude"
                type="number"
                label="Longitude"
                value={establishmentForm.longitude}
                placeholder="Longitude do estabelecimento"
                onChange={(e) => handleForm(e, 'longitude')}
                InputProps={{ readOnly: !edit }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} paddingTop={2}>
            <Grid item xs={24} sm={12}>
              <Divider>
                <Chip icon={<MyLocation />} sx={{ color: '#00000090' }} label="LOCALIZAÇÃO" />
              </Divider>
            </Grid>
            <Grid item xs={24} sm={12}>
              <div className="flex w-full h-[350px] align-middle justify-center">
                {establishmentForm.latitude !== 0 && establishmentForm.longitude !== 0 ? (
                  <Map
                    defaultCenter={defaultCoordinates}
                    coordinates={{
                      lat: Number(establishmentForm.latitude),
                      lng: Number(establishmentForm.longitude),
                      title: establishmentForm.name,
                    }}
                    zoomLevel={16}
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
                        color: '#ef8f01',
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
              >
                Salvar alterações
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Paper>
      {(isFetching || establishmentMutation.isLoading) && <ColoredLinearProgress />}
      <SnackbarAlert
        backgroundColor="#367315"
        open={showUpdateSuccessMessage}
        text="Dados atualizados com sucesso"
        handleClose={handleMessageClose}
      />
      <SnackbarAlert backgroundColor="#B00020" open={!!errorMessage} text={errorMessage} handleClose={handleMessageClose} />
    </div>
  );
};

export default UserDetails;