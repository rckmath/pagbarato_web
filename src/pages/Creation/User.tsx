import { AxiosError } from 'axios';
import ptBRLocale from 'date-fns/locale/pt-BR';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { Chip, Divider, Grid, MenuItem, Paper, TextField, Tooltip } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, FunctionComponent, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Info, Lock, Send } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { useAuth } from '../../context/AuthProvider';
import SnackbarAlert from '../../components/SnackbarAlert';
import { createUser } from '../../services/user';
import { UserForm, UserRoleMap } from '../../models/user';
import { errorDispatcher, IBaseResponse } from '../../services/api';
import { ColoredIconButton } from '../../components/Buttons/ColoredIconButton';
import { ColoredLinearProgress } from '../../components/ColoredLinearProgress';

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

interface UserCreationProps {}

const UserCreation: FunctionComponent<UserCreationProps> = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [showCreateSuccessMessage, setShowCreateSuccessMessage] = useState(false);
  const [userForm, setUserForm] = useState<UserForm>({
    name: '',
    email: '',
    role: '',
    password: '',
    createdAt: '',
    birthDate: null,
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, refresh } = useAuth();
  const accessToken = user != undefined && user ? (user.accessToken as string) : sessionStorage.getItem('accessToken');

  const userMutation = useMutation((userForm: UserForm) => createUser(userForm, { accessToken }), {
    onSuccess: (data) => {
      setShowCreateSuccessMessage(true);
      queryClient.invalidateQueries(['usersList']);
      setTimeout(() => {
        navigate(`/users/${data.id}`);
      }, 500);
    },
    onError: (err) => errorDispatcher(err as AxiosError<IBaseResponse>, refresh),
  });

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
      if (!userForm.password || !userForm.confirmPassword) throw new Error('Preencha todos os campos!');
      const comparisonResult = userForm.password.localeCompare(userForm.confirmPassword);
      if (comparisonResult !== 0) throw new Error('As senhas não coincidem!');
      await userMutation.mutateAsync(userForm);
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
    <div className="flex flex-col w-full ">
      <h1 className="text-3xl font-bold mb-2 text-[#00000090]">Criar novo usuário</h1>
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
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={24} sm={12}>
              <Divider>
                <Chip icon={<Info />} sx={{ color: '#00000090' }} label="DADOS DA CONTA" />
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                variant="outlined"
                sx={inputStyle}
                type="text"
                label="Nome"
                value={userForm.name}
                placeholder="Nome do usuário"
                onChange={(e) => handleForm(e, 'name')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                sx={inputStyle}
                label="Email"
                placeholder="Email do usuário"
                type="email"
                variant="outlined"
                value={userForm.email}
                onChange={(e) => handleForm(e, 'email')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBRLocale}>
                <DatePicker
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
                  renderInput={(params) => {
                    return <TextField sx={inputStyle} fullWidth variant="outlined" {...params} />;
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                select
                variant="outlined"
                sx={inputStyle}
                label="Tipo"
                value={userForm.role}
                placeholder="Tipo de usuário"
                onChange={(e) => handleForm(e, 'role')}
              >
                {UserRoleMap.map((role) => {
                  return (
                    <MenuItem key={role[0]} value={role[0]}>
                      {role[1]}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
            <Grid item xs={24} sm={12}>
              <Divider>
                <Chip icon={<Lock />} sx={{ color: '#00000090' }} label="CREDENCIAIS DE ENTRADA" />
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                sx={inputStyle}
                label="Senha"
                placeholder="Insira uma senha"
                type="password"
                variant="outlined"
                value={userForm.password}
                onChange={(e) => handleForm(e, 'password')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                sx={inputStyle}
                label="Confirmação de senha"
                placeholder="Insira a confirmação de senha"
                type="password"
                variant="outlined"
                value={userForm.confirmPassword}
                onChange={(e) => handleForm(e, 'confirmPassword')}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} paddingTop={3}>
            <Grid item xs={24} sm={12} textAlign="right">
              <LoadingButton endIcon={<Send />} loading={userMutation.isLoading} type="submit" variant="contained" style={btnStyle}>
                Salvar
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Paper>
      {userMutation.isLoading && <ColoredLinearProgress />}
      <SnackbarAlert
        backgroundColor="#367315"
        open={showCreateSuccessMessage}
        text="Usuário criado com sucesso"
        handleClose={handleMessageClose}
      />
      <SnackbarAlert backgroundColor="#B00020" open={!!errorMessage} text={errorMessage} handleClose={handleMessageClose} />
    </div>
  );
};

export default UserCreation;
