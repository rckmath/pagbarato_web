import { Box, Grid, Paper, styled } from '@mui/material'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

const Login = () => {
  return (
    <Box sx={{ height: '100vh' }}>
      <Grid container spacing={2} sx={{ height: '100vh' }}>
        <Grid item xs={7}>
          <Item>xs=7</Item>
        </Grid>
        <Grid item xs={5}>
          <Item>xs=5</Item>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Login
