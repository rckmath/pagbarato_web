import { Box, MenuItem, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { subDays } from 'date-fns';
import { FunctionComponent, SyntheticEvent, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { inputStyle } from '../components/CommonStyles';
import NumberCard from '../components/Dashboard/NumberCard';

import SnackbarAlert from '../components/SnackbarAlert';
import { useAuth } from '../context/AuthProvider';
import { DashboardTotals } from '../models/dashboard';
import { errorDispatcher, IBaseResponse } from '../services/api';
import { getTotals } from '../services/dashboard';

type Percentages = {
  user: number | string;
  establishment: number | string;
  product: number | string;
  price: number | string;
};

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
  const { state }: { state: any } = useLocation();
  const [welcomeMessage, setShowWelcomeMessage] = useState<string>(state?.welcomeMessage);
  const [fromDate, setFromDate] = useState<string | Date>(subDays(new Date(), 7).toDateString());
  const [growthPercentages, setGrowthPercentages] = useState<Percentages>({
    user: 0,
    establishment: 0,
    product: 0,
    price: 0,
  });

  const { user, refresh } = useAuth();
  const accessToken = user != undefined && user ? (user.accessToken as string) : sessionStorage.getItem('accessToken');

  const { isFetching: totalsFetching, data: totals } = useQuery<DashboardTotals>(['dashboardTotals'], () => getTotals({ accessToken }), {
    enabled: !!accessToken,
    staleTime: 1000 * 60,
    onError: (err) => errorDispatcher(err as AxiosError<IBaseResponse>, refresh),
  });

  const { isFetching: lastDaysFetching, data: lastDays } = useQuery<DashboardTotals>(
    ['dashboardLastDaysCount', fromDate],
    () => getTotals({ accessToken, fromDate }),
    {
      enabled: !!accessToken,
      staleTime: 1000 * 60,
      onError: (err) => errorDispatcher(err as AxiosError<IBaseResponse>, refresh),
    },
  );

  const handleClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setShowWelcomeMessage('');
  };

  useEffect(() => {
    if (totals && lastDays) {
      setGrowthPercentages({
        user: totals.userCount ? ((lastDays.userCount / totals.userCount) * 100).toFixed(2) : 0,
        establishment: totals.establishmentCount ? ((lastDays.establishmentCount / totals.establishmentCount) * 100).toFixed(2) : 0,
        product: totals.productCount ? ((lastDays.productCount / totals.productCount) * 100).toFixed(2) : 0,
        price: totals.priceCount ? ((lastDays.priceCount / totals.priceCount) * 100).toFixed(2) : 0,
      });
    }
  }, [totals, lastDays]);

  return (
    <div className="flex flex-col w-full">
      <SnackbarAlert backgroundColor="#012900" open={!!welcomeMessage} text={welcomeMessage} handleClose={handleClose} />
      <div className="flex flex-col flex-1">
        <h1 className="text-3xl font-semibold mb-2 text-[#0A0A0A]">Olá, {user?.displayName}</h1>{' '}
        <div className="h-1 w-10 mr-2 bg-main-orange"></div>
      </div>
      <Box
        sx={{
          paddingTop: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignItems: 'center',
            p: 3,
            gap: 1.5,
            borderRadius: 4,
            backgroundColor: '#f9f9f9',
          }}
        >
          <NumberCard title="Nº total de usuários" value={totals?.userCount} loading={totalsFetching} />
          <NumberCard title="Nº total de estabelecimentos" value={totals?.establishmentCount} loading={totalsFetching} />
          <NumberCard title="Nº total de produtos" value={totals?.productCount} loading={totalsFetching} />
          <NumberCard title="Nº total de preços" value={totals?.priceCount} loading={totalsFetching} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'space-around',
            p: 3,
            gap: 1.5,
            marginY: 2,
            borderRadius: 4,
            backgroundColor: '#f9f9f9',
          }}
        >
          <Box component="form" autoComplete="off">
            <TextField
              select
              variant="standard"
              label="Buscar dados dos:"
              sx={{ ...inputStyle, minWidth: 150 }}
              size="small"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
              }}
            >
              <MenuItem value={subDays(new Date(), 7).toDateString()}>Últimos 7 dias</MenuItem>
              <MenuItem value={subDays(new Date(), 15).toDateString()}>Últimos 15 dias</MenuItem>
              <MenuItem value={subDays(new Date(), 30).toDateString()}>Últimos 30 dias</MenuItem>
              <MenuItem value={subDays(new Date(), 90).toDateString()}>Últimos 90 dias</MenuItem>
            </TextField>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignContent: 'center',
              justifyContent: 'space-around',
              gap: 1.5,
            }}
          >
            <NumberCard
              backgroundColor="#fff"
              textColor="#0008"
              title="Novos cadastros"
              value={lastDays?.userCount}
              percentage={growthPercentages.user}
              loading={lastDaysFetching}
            />
            <NumberCard
              backgroundColor="#fff"
              textColor="#0008"
              title="Novos estabelecimentos"
              value={lastDays?.establishmentCount}
              percentage={growthPercentages.establishment}
              loading={lastDaysFetching}
            />
            <NumberCard
              backgroundColor="#fff"
              textColor="#0008"
              title="Novos produtos"
              value={lastDays?.productCount}
              percentage={growthPercentages.product}
              loading={lastDaysFetching}
            />
            <NumberCard
              backgroundColor="#fff"
              textColor="#0008"
              title="Novas publicações de preço"
              value={lastDays?.priceCount}
              percentage={growthPercentages.price}
              loading={lastDaysFetching}
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Home;
