import ptBRLocale from 'date-fns/locale/pt-BR';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { Chip, Divider, Grid, Paper, TextField, Tooltip } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, FunctionComponent, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack, Edit, EditOff, Send } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { User, UserForm } from '../../models/user';
import { useAuth } from '../../context/AuthProvider';
import SnackbarAlert from '../../components/SnackbarAlert';
import { getUserById, updateUser } from '../../services/user';
import { ColoredIconButton } from '../../components/Buttons/ColoredIconButton';
import { ColoredLinearProgress } from '../../components/ColoredLinearProgress';
import { User as FirebaseUser, updatePassword } from 'firebase/auth';
import { errorDispatcher, IBaseResponse } from '../../services/api';
import { AxiosError } from 'axios';

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
  const [fieldsVariant, setFieldsVariant] = useState<TextFieldVariant>('filled');
  const [showUpdateSuccessMessage, setShowUpdateSuccessMessage] = useState(false);
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem('accessToken'));
  const [userForm, setUserForm] = useState<UserForm>({
    email: '',
    name: '',
    password: '',
    birthDate: null,
    confirmPassword: '',
  });

  const params = useParams();
  const navigate = useNavigate();
  const { user, logIn } = useAuth();
  const queryClient = useQueryClient();

  const { isFetching } = useQuery<User>(['user', params.id], () => getUserById(params.id as string, { accessToken }), {
    refetchOnWindowFocus: false,
    onSuccess: (data) => setUserForm({ ...userForm, ...data }),
    onError: (err) => errorDispatcher(err as AxiosError<IBaseResponse>, user),
  });

  const userMutation = useMutation((userForm: UserForm) => updateUser(params.id as string, userForm, { accessToken }), {
    onSuccess: () => {
      queryClient.invalidateQueries(['usersList']);
    },
  });

  const updateUserPassword = async (user: FirebaseUser, password: string, confirmPassword: string) => {
    const comparisonResult = password.localeCompare(confirmPassword);
    if (comparisonResult !== 0) throw new Error('As senhas não coincidem!');
    await userMutation.mutateAsync(userForm);
    await updatePassword(user, password);
    await logIn(user?.email as string, password);
  };

  const handleGoBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/users', { replace: true });
    }
  };

  const handleForm = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, param: string) => {
    setUserForm({
      ...userForm,
      [param]: e.target.value,
    });
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (userForm.password && userForm.confirmPassword) {
        await updateUserPassword(user as FirebaseUser, userForm.password, userForm.confirmPassword);
        setShowUpdateSuccessMessage(true);
        return;
      }

      await userMutation.mutateAsync(userForm);
      setShowUpdateSuccessMessage(true);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleSuccessMessageClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setShowUpdateSuccessMessage(false);
  };

  const handleErrorMessageClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setErrorMessage('');
  };

  useEffect(() => {
    if (edit) setFieldsVariant('outlined');
    else setFieldsVariant('filled');
  }, [edit]);

  useEffect(() => {
    if (user) setAccessToken(user.accessToken as string);
  }, [user]);

  return (
    <div className="flex flex-col w-full ">
      <h1 className="text-3xl font-bold mb-2 text-[#00000090]">Detalhes</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <Paper sx={{ paddingX: '2.5rem', paddingY: '1rem', marginTop: '1.5rem', minWidth: 400 }}>
          <Grid container paddingBottom={4}>
            <Grid item xs={12} sm={6} textAlign="left">
              <Tooltip title="Voltar para listagem" placement="top" arrow>
                <ColoredIconButton size="small" onClick={handleGoBack} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.06)' }}>
                  <ArrowBack size="inherit" />
                </ColoredIconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} textAlign="right">
              <Tooltip title={`${edit ? 'Desabilitar' : 'Habilitar'} edição`} placement="top" arrow>
                <ColoredIconButton size="small" onClick={() => setEdit(!edit)} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.06)' }}>
                  {edit ? <Edit size="inherit" /> : <EditOff size="inherit" />}
                </ColoredIconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={24} sm={12}>
              <Divider>
                <Chip sx={{ fontWeight: 'bold', color: '#00000090' }} label="INFORMAÇÕES DA CONTA" />
              </Divider>
            </Grid>
            <Grid item xs={24} sm={12}>
              <TextField
                fullWidth
                required
                variant={fieldsVariant}
                sx={inputStyle}
                id="name"
                type="text"
                label="Nome"
                value={userForm.name}
                placeholder="Nome do usuário"
                onChange={(e) => handleForm(e, 'name')}
                InputProps={{ readOnly: !edit }}
              />
            </Grid>
            <Grid item xs={8} sm={8}>
              <TextField
                required
                fullWidth
                sx={inputStyle}
                id="email"
                label="Email"
                placeholder="Email do usuário"
                type="email"
                variant="filled"
                value={userForm.email}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={4} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBRLocale}>
                <DatePicker
                  loading={isFetching}
                  label="Data de nascimento"
                  value={userForm.birthDate}
                  onChange={(newValue: any) => {
                    setUserForm({
                      ...userForm,
                      birthDate: newValue,
                    });
                  }}
                  openTo="year"
                  disableFuture
                  readOnly={!edit}
                  renderInput={(params) => {
                    return <TextField sx={inputStyle} fullWidth variant={fieldsVariant} {...params} />;
                  }}
                />
              </LocalizationProvider>
            </Grid>
            {user?.email === userForm.email && (
              <>
                <Grid item xs={24} sm={12}>
                  <Divider>
                    <Chip sx={{ fontWeight: 'bold', color: '#00000090' }} label="ALTERAÇÃO DE SENHA" />
                  </Divider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    sx={inputStyle}
                    id="password"
                    label="Nova senha"
                    placeholder="Insira uma nova senha"
                    type="password"
                    variant={fieldsVariant}
                    value={userForm.password}
                    onChange={(e) => handleForm(e, 'password')}
                    InputProps={{ readOnly: !edit }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    sx={inputStyle}
                    id="passwordConfirm"
                    label="Confirmação de nova senha"
                    placeholder="Insira a confirmação de nova senha"
                    type="password"
                    variant={fieldsVariant}
                    value={userForm.confirmPassword}
                    onChange={(e) => handleForm(e, 'confirmPassword')}
                    InputProps={{ readOnly: !edit }}
                  />
                </Grid>
              </>
            )}
          </Grid>
          <Grid container spacing={4} paddingTop={3}>
            <Grid item xs={24} sm={12} textAlign="right">
              <LoadingButton
                endIcon={<Send />}
                loading={userMutation.isLoading}
                disabled={!edit}
                type="submit"
                variant="contained"
                style={btnStyle}
              >
                Salvar alterações
              </LoadingButton>
            </Grid>
          </Grid>
        </Paper>
        {(isFetching || userMutation.isLoading) && <ColoredLinearProgress />}
      </form>
      <SnackbarAlert
        backgroundColor="#367315"
        open={showUpdateSuccessMessage}
        text="Dados atualizados com sucesso"
        handleClose={handleSuccessMessageClose}
      />
      <SnackbarAlert backgroundColor="#B00020" open={!!errorMessage} text={errorMessage} handleClose={handleErrorMessageClose} />
    </div>
  );
};

export default UserDetails;
