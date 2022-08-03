import { SyntheticEvent, useState } from 'react'

import { LockOutlined } from '@mui/icons-material'
import { Avatar, Box, Grid, Button, styled, Paper, TextField, FormControlLabel, Checkbox, Stack } from '@mui/material'

import './loginStyles.css'
import LogoImage from '../../assets/logo-white.png'

import { UserAuth } from '../../context/AuthProvider'
import { useNavigate } from 'react-router-dom'

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  height: '100vh',
  color: theme.palette.text.secondary,
  position: 'relative',
  textAlign: 'center',
}))

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const { logIn } = UserAuth()

  const paperStyle = { padding: 20, height: '60vh', width: 428, margin: '20px auto' }
  const avatarStyle = { backgroundColor: '#EF8F01', padding: 32 }
  const btnStyle = { backgroundColor: '#EF8F01', margin: '8px 0' }
  const checkboxStyle = {
    color: '#EF8F01',
    '&.Mui-checked': {
      color: '#EF8F01',
    },
  }
  const inputStyle = {
    paddingBottom: 1,
    '& label.Mui-focused': {
      color: '#EF8F01',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#EF8F01',
    },
  }

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await logIn(email, password)
      navigate('/home')
    } catch (err: any) {
      console.log(err.message)
    }
  }

  return (
    <Box sx={{ height: '100vh' }}>
      <Grid container spacing={0} sx={{ height: '100vh' }}>
        <Grid item xs={7}>
          <Item sx={{ backgroundColor: '#367315' }}>
            <img className="logo" src={LogoImage} alt="PagBarato" />
          </Item>
        </Grid>
        <Grid item xs={5}>
          <Item sx={{ display: 'flex', alignItems: 'center' }}>
            <Paper component={Stack} direction="column" justifyContent="center" elevation={2} style={paperStyle}>
              <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" paddingBottom={4}>
                <Avatar style={avatarStyle}>
                  <LockOutlined fontSize="large" />
                </Avatar>
              </Grid>
              <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                <TextField
                  sx={inputStyle}
                  id="email"
                  label="Email"
                  placeholder="Insira seu e-mail"
                  type="email"
                  variant="standard"
                  fullWidth
                  required
                  multiline
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  sx={inputStyle}
                  id="password"
                  label="Senha"
                  placeholder="Insira sua senha"
                  type="password"
                  autoComplete="current-password"
                  variant="standard"
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FormControlLabel
                  label="Lembre-me"
                  sx={{ paddingTop: 1, paddingBottom: 4 }}
                  control={<Checkbox name="checked" sx={checkboxStyle} />}
                />
                <Button type="submit" variant="contained" style={btnStyle} fullWidth>
                  Log-In
                </Button>
              </form>
            </Paper>
          </Item>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Login
