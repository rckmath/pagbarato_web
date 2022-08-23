import { Card, CardContent, Divider, Typography, CircularProgress } from '@mui/material';
import { FunctionComponent } from 'react';

const cardTitleStyle = { fontSize: 11.5, letterSpacing: 0.2 };
const cardStyle = {
  boxShadow: '-4px 4px 0px #367315',
  backgroundColor: '#4ea529',
  color: '#fff',
  minWidth: 220,
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
          {props.loading && !props.value ? <CircularProgress /> : props.value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NumberCard;
