import { Alert as MuiAlert, AlertProps, Snackbar } from '@mui/material';
import { forwardRef, FunctionComponent, SyntheticEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props: any, ref: any) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
  const { state }: { state: any } = useLocation();
  const [loginMessage, setLoginMessage] = useState(state?.cameFromLogin);

  const handleClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setLoginMessage(false);
  };

  return (
    <div>
      <Snackbar
        open={loginMessage}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert sx={{ width: '100%', backgroundColor: '#367315' }} onClose={handleClose}>
          Login efetuado com sucesso
        </Alert>
      </Snackbar>
      <h1 className='text-4xl font-bold p-[60px]'>Dashboard</h1>
    </div>
  );
};

export default Home;
