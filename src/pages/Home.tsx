import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FunctionComponent, SyntheticEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NumberCard from '../components/Dashboard/NumberCard';

import SnackbarAlert from '../components/SnackbarAlert';
import { useAuth } from '../context/AuthProvider';
import { DashboardTotals } from '../models/dashboard';
import { errorDispatcher, IBaseResponse } from '../services/api';
import { getTotals } from '../services/dashboard';

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
  const { state }: { state: any } = useLocation();
  const [welcomeMessage, setShowWelcomeMessage] = useState<string>(state?.welcomeMessage);

  const { user, refresh } = useAuth();
  const accessToken = user != undefined && user ? (user.accessToken as string) : sessionStorage.getItem('accessToken');

  const { isFetching, data } = useQuery<DashboardTotals>(['dashboardTotals'], () => getTotals({ accessToken }), {
    enabled: !!accessToken,
    staleTime: 1000 * 60,
    onError: (err) => errorDispatcher(err as AxiosError<IBaseResponse>, refresh),
  });

  const handleClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setShowWelcomeMessage('');
  };

  return (
    <div className="flex flex-col w-full ">
      <SnackbarAlert backgroundColor="#367315" open={!!welcomeMessage} text={welcomeMessage} handleClose={handleClose} />
      <h1 className="text-3xl font-bold mb-2 text-[#00000090]">Olá, {user?.displayName}</h1>
      <hr />
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          alignContent: 'space-around',
          p: 3,
          gap: 2,
          marginY: 2,
          border: 1,
          borderRadius: 2,
          borderColor: '#eee',
        }}
      >
        <NumberCard title="Nº total de usuários" value={data?.userCount} loading={isFetching} />
        <NumberCard title="Nº total de estabelecimentos" value={data?.establishmentCount} loading={isFetching} />
        <NumberCard title="Nº total de produtos" value={data?.productCount} loading={isFetching} />
        <NumberCard title="Nº total de preços" value={data?.priceCount} loading={isFetching} />
      </Box>
    </div>
  );
};

export default Home;
