import { Error, KeyboardArrowUp, KeyboardDoubleArrowUp } from '@mui/icons-material';
import { Card, CardContent, Divider, Typography, CircularProgress, Stack, Box } from '@mui/material';
import { FunctionComponent } from 'react';

const cardTitleStyle = { fontSize: 11.5, letterSpacing: 0.2 };

interface NumberCardProps {
  title: string;
  value: string | number | undefined;
  loading?: boolean;
  textColor?: string;
  backgroundColor?: string;
  percentage?: string | number;
}

const NumberCard: FunctionComponent<NumberCardProps> = (props) => {
  const backgroundColor = props.backgroundColor || '#012900';
  const textColor = props.textColor || '#fff';

  const cardStyle = {
    backgroundColor: backgroundColor,
    color: textColor,
    minWidth: 230,
    maxWidth: '17vw',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const cardCountTextStyle = {
    display: 'flex',
    marginTop: 1.5,
    fontSize: 40,
    color: textColor,
    lineHeight: 0.7,
    justifyContent: 'center',
    '& .MuiCircularProgress-root': { color: textColor },
  };

  return (
    <Card sx={cardStyle} elevation={3}>
      <CardContent>
        <Typography fontWeight="bold" variant="overline" sx={cardTitleStyle} gutterBottom>
          {props.title}
        </Typography>
        <Divider variant="middle" />
        <Box sx={cardCountTextStyle}>
          {props.loading ? (
            <CircularProgress />
          ) : props.value || props.value === 0 ? (
            <Stack height="100%" alignItems="center" justifyContent="center" spacing={1} direction="row">
              <Typography fontWeight="bold" variant="h3" sx={cardCountTextStyle}>
                {props.value}
              </Typography>
              {props.percentage !== undefined ? (
                <Stack
                  height="100%"
                  alignItems="center"
                  direction="row"
                  spacing={0}
                  sx={{ color: `${props.percentage > 0 ? '#03B800' : textColor}`, fontSize: 15 }}
                >
                  <Typography fontWeight="bold" variant="overline" fontSize={11}>
                    {props.percentage}%
                  </Typography>
                  {props.percentage > 0 && props.percentage <= 50 ? <KeyboardArrowUp fontSize="inherit" /> : <></>}
                  {props.percentage > 50 ? <KeyboardDoubleArrowUp fontSize="inherit" /> : <></>}
                </Stack>
              ) : (
                <></>
              )}
            </Stack>
          ) : (
            <Stack height="100%" alignItems="center" justifyContent="center" spacing={1} direction="row">
              <Error fontSize="inherit" />
              <Typography textAlign="left" fontWeight="bold" variant="overline" lineHeight={1.5}>
                Erro ao carregar
                <br />
                informações
              </Typography>
            </Stack>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default NumberCard;
