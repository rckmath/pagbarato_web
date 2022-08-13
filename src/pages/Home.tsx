import { FunctionComponent, SyntheticEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Map from '../components/Map';
import SnackbarAlert from '../components/SnackbarAlert';

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
  const { state }: { state: any } = useLocation();
  const [welcomeMessage, setShowWelcomeMessage] = useState<string>(state?.welcomeMessage);

  const handleClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setShowWelcomeMessage('');
  };

  return (
    <div>
      <SnackbarAlert backgroundColor="#367315" open={!!welcomeMessage} text={welcomeMessage} handleClose={handleClose} />
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <hr />
    </div>
  );
};

export default Home;
