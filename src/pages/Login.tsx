import { FunctionComponent, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { EmailRounded, LockOutlined, KeyRounded } from '@mui/icons-material';
import { Box, Grid, styled, Paper, TextField, FormControlLabel, Checkbox, Stack, InputAdornment, Divider, Chip } from '@mui/material';

import LogoImage from '../assets/logo-white.png';
import { useAuth } from '../context/AuthProvider';
import SnackbarAlert from '../components/SnackbarAlert';
import { btnStyle, inputStyle } from '../components/CommonStyles';

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  height: '100vh',
  color: theme.palette.text.secondary,
  position: 'relative',
  textAlign: 'center',
}));

interface LoginProps {}

const Login: FunctionComponent<LoginProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const navigate = useNavigate();
  const { logIn, user } = useAuth();

  useEffect(() => {
    if (user) navigate('/', { state: { welcomeMessage: 'Bem-vindo novamente!' } });
  }, [user]);

  const paperStyle = { padding: 20, height: '60vh', width: 428, margin: '20px auto' };
  const checkboxStyle = {
    color: '#012900',
    '&.Mui-checked': {
      color: '#012900',
    },
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      await logIn(email, password);
      navigate('/', { state: { welcomeMessage: 'Login efetuado com sucesso!' } });
    } catch (err: any) {
      setShowErrorMessage(true);
    }

    setLoading(false);
  };

  const handleClose = (_e?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setShowErrorMessage(false);
  };

  return (
    <Box sx={{ height: '100vh' }}>
      <Grid container spacing={0} sx={{ height: '100vh' }}>
        <Grid item xs={7}>
          <Item sx={{ backgroundColor: '#fb5607' }}>
            <img
              className="m-auto w-auto h-auto max-h-full max-w-full absolute top-0 bottom-0 left-0 right-0"
              src={LogoImage}
              alt="PagBarato"
            />
          </Item>
        </Grid>
        <Grid item xs={5}>
          <Item sx={{ display: 'flex', alignItems: 'center' }}>
            <Paper component={Stack} direction="column" justifyContent="center" elevation={2} style={paperStyle}>
              <Grid item paddingBottom={6}>
                <Divider sx={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Chip
                    sx={{ padding: 2.25, backgroundColor: '#012900', color: '#fff' }}
                    icon={<LockOutlined sx={{ '&&': { color: '#fff' } }} />}
                    label="Entre com suas credenciais"
                  />
                </Divider>
              </Grid>
              <Box component="form" onSubmit={handleSubmit} style={{ textAlign: 'left' }} autoComplete="off">
                <TextField
                  sx={inputStyle}
                  label="Email"
                  placeholder="Insira seu e-mail"
                  type="email"
                  variant="standard"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailRounded />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  sx={inputStyle}
                  label="Senha"
                  placeholder="Insira sua senha"
                  type="password"
                  autoComplete="current-password"
                  variant="standard"
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyRounded />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControlLabel
                  label="Lembre-me"
                  sx={{ paddingTop: 1, paddingBottom: 4 }}
                  control={<Checkbox name="checked" sx={checkboxStyle} />}
                />
                <LoadingButton loading={loading} type="submit" variant="contained" style={btnStyle} fullWidth>
                  Log-In
                </LoadingButton>
              </Box>
            </Paper>
          </Item>
        </Grid>
        <SnackbarAlert
          backgroundColor="#B00020"
          open={showErrorMessage}
          text="Credenciais incorretas. Verifique e tente novamente!"
          handleClose={handleClose}
        />
      </Grid>
    </Box>
  );
};

export default Login;
