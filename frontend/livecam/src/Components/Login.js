import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Stack, Container, Typography, Snackbar, Alert, IconButton, InputAdornment, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {

    localStorage.clear();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    if (!username) {
      setUsernameError('Username is required');
      hasError = true;
    } else {
      setUsernameError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) {
      return;
    }

    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/login/`;
      const response = await axios.post(apiUrl, {
        username,
        password,
      });
      //setToken(response.data.access);
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('ref_token', response.data.refresh);
      setSnackbarMessage('Login successful!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      navigate('/cameras');
    } catch (error) {
      if(error.message === "Network Error"){
        navigate('/server-error')
      }
      setSnackbarMessage('Incorrect credentials, please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      console.error("There was an error logging in!", error);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const handleRegisterRedirect = () => {
    navigate('/register');
  };
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (e.target.value) {
      setUsernameError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value) {
      setPasswordError('');
    }
  };

  return (
    <>
      <Container
        maxWidth={false} 
        disableGutters
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#1976d2', 
          padding: 0,
          margin: 0,
          width: '100vw', 
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            width: '100%',
            maxWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Stack spacing={2}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={handleUsernameChange}
                error={!!usernameError}
                helperText={usernameError}
                sx={{
                  '& .MuiInputLabel-root': {
                    lineHeight: '14px', 
                  },
                  '& .MuiInputBase-root': {
                    height: 42,
                  },
                }}
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                value={password}
                onChange={handlePasswordChange}
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputLabel-root': {
                    lineHeight: '14px', 
                  },
                  '& .MuiInputBase-root': {
                    height: 42,
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Login
              </Button>
            </Stack>
          </form>
          <Stack spacing={1} sx={{ marginTop: 2, width: '100%' }} alignItems="center">
            <Link href="/forgot-password" variant="body2" sx={{ cursor: 'pointer' }}>
              Forgot Password?
            </Link>
            <Link onClick={handleRegisterRedirect} variant="body2" sx={{ cursor: 'pointer' }}>
              Don't have an account? Sign Up
            </Link>
          </Stack>
        </Paper>
      </Container>

      {/* Snackbar positioned outside of the Paper */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
        sx={{
          position: 'fixed',
          top: 16, 
          left: '50%',
          transform: 'translateX(-50%)', 
          width: 'calc(100% - 32px)', 
          maxWidth: 400,
          zIndex: 1300,
        }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;

