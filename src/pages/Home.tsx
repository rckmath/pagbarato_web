import { FunctionComponent, SyntheticEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';

import SnackbarAlert from '../components/SnackbarAlert';

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
  const { state }: { state: any } = useLocation();
  const [showLoginMessage, setShowLoginMessage] = useState(state?.cameFromLogin);

  const loginMessage = (showLoginMessage === 1 && 'Login efetuado com sucesso') || (showLoginMessage === 2 && 'Bem-vindo novamente!') || '';

  const handleClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setShowLoginMessage(false);
  };

  return (
    <div>
      <SnackbarAlert backgroundColor="#367315" open={!!showLoginMessage} text={loginMessage} handleClose={handleClose} />
      <h1 className="text-4xl font-bold">Dashboard</h1>
    </div>
  );
};

export default Home;
