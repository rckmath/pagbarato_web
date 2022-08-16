import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBRLocale from 'date-fns/locale/pt-BR';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { Grid, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, FunctionComponent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { User, UserForm } from '../../models/user';
import { getUserById } from '../../services/user';
import { ColoredIconButton } from '../../components/Buttons/ColoredIconButton';
import { ArrowBack, Edit, EditOff } from '@mui/icons-material';

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

interface UserDetailsProps {}

const UserDetails: FunctionComponent<UserDetailsProps> = () => {
  const [edit, setEdit] = useState(false);
  const [userForm, setUserForm] = useState<UserForm>({
    email: '',
    name: '',
    birthDate: null,
  });

  const { user } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const accessToken = user?.accessToken || sessionStorage.getItem('accessToken');

  const { isFetching } = useQuery<User>(['user', params.id], () => getUserById(params.id as string, { accessToken }), {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setUserForm({ ...userForm, ...data });
    },
  });

  const handleGoBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/users', { replace: true }); // the current entry in the history stack will be replaced with the new one with { replace: true }
    }
  };

  const handleForm = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, param: string) => {
    setUserForm({
      ...userForm,
      [param]: e.target.value,
    });
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-3xl font-bold mb-2">Detalhes</h1>
      <hr />
      <form>
        <Paper sx={{ padding: '1.5rem', marginTop: '1.5rem', minWidth: 400 }}>
          {isFetching && <Typography>Carregando...</Typography>}
          <Grid container marginBottom={4}>
            <Grid item xs={12} sm={6} textAlign="left">
              <Tooltip title="Voltar para listagem" placement="top" arrow>
                <ColoredIconButton onClick={handleGoBack}>
                  <ArrowBack />
                </ColoredIconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} textAlign="right">
              <Tooltip title={edit ? 'Desabilitar edição' : 'Habilitar edição '} placement="top" arrow>
                <ColoredIconButton
                  onClick={() => {
                    setEdit(!edit);
                  }}
                >
                  {edit ? <Edit /> : <EditOff />}
                </ColoredIconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                variant="filled"
                sx={inputStyle}
                id="name"
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
                id="email"
                label="Email"
                placeholder="Email do usuário"
                type="email"
                variant="filled"
                value={userForm.email}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4}>
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
                  renderInput={(params) => {
                    return <TextField sx={inputStyle} fullWidth variant="filled" {...params} />;
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={4} sm={4}>
              <TextField
                fullWidth
                sx={inputStyle}
                id="password"
                label="Nova senha"
                placeholder="Insira uma nova senha"
                type="password"
                variant="filled"
                value={userForm.password}
                onChange={(e) => handleForm(e, 'password')}
              />
            </Grid>
            <Grid item xs={4} sm={4}>
              <TextField
                fullWidth
                sx={inputStyle}
                id="passwordConfirm"
                label="Confirmação de nova senha"
                placeholder="Insira a confirmação de nova senha"
                type="password"
                variant="filled"
                value={userForm.confirmPassword}
                onChange={(e) => handleForm(e, 'confirmPassword')}
              />
            </Grid>
          </Grid>
        </Paper>
      </form>
    </div>
  );
};

export default UserDetails;
