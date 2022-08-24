import { Error } from '@mui/icons-material';
import { Card, CardContent, Divider, Typography, CircularProgress, Stack, Box } from '@mui/material';
import { FunctionComponent } from 'react';

const cardTitleStyle = { fontSize: 11.5, letterSpacing: 0.2 };
const cardStyle = {
  boxShadow: '-4px 4px 0px #367315',
  backgroundColor: '#4ea529',
  color: '#fff',
  minWidth: 240,
  maxWidth: '17vw',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const cardCountTextStyle = {
  marginTop: 2,
  fontSize: 32,
  color: '#fff',
  lineHeight: 1.1,
  '& .MuiCircularProgress-root': { color: '#fff' },
};

interface NumberCardProps {
  title: string;
  value: string | number | undefined;
  loading?: boolean;
}

const NumberCard: FunctionComponent<NumberCardProps> = (props) => {
  return (
    <Card sx={cardStyle} elevation={6}>
      <CardContent>
        <Typography fontWeight="bold" variant="overline" sx={cardTitleStyle} gutterBottom>
          {props.title}
        </Typography>
        <Divider variant="middle" />
        <Typography fontWeight="bold" variant="h3" sx={cardCountTextStyle}>
          {props.loading ? (
            <CircularProgress />
          ) : props.value ? (
            props.value
          ) : (
            <Stack height="100%" alignItems="center" justifyContent="center" spacing={1} direction="row" paddingBottom={2}>
              <Error fontSize="inherit" />
              <Typography textAlign="left" fontWeight="bold" variant="overline" lineHeight="1.2">
                Erro ao carregar
                <br />
                informações
              </Typography>
            </Stack>
          )}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NumberCard;
