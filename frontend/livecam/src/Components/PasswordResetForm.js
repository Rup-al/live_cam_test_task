import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  TextField,
  Button,
  Stack,
  Container,
  Typography,
  Snackbar,
  Alert,
  Paper,
  Box,
  IconButton,
  InputAdornment
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (!token) {
      navigate('/');
      return;
    }

    axios.post(`${process.env.REACT_APP_API_URL}/validate-reset-token/`, { token })
      .then(response => {
        if (!response.data.valid) {
          setSnackbarMessage('Token has expired or is invalid. Please request a new password reset.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          setTimeout(() => navigate('/'), 1000);
        }
      })
      .catch(error => {
        setSnackbarMessage('Failed to validate token.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        setTimeout(() => navigate('/'), 1000);
      });
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = new URLSearchParams(location.search).get('token');
    let hasError = false;

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Confirmation is required');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    } else {
      setConfirmPasswordError('');
    }

    if (hasError) {
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/reset-password-confirm/`, {
        token,
        password
      });

      setSnackbarMessage('Password reset successful!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      setSnackbarMessage('Failed to reset password.');
      setSnackbarSeverity('error');
      setTimeout(() => navigate('/'), 1000);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
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
        position: 'relative',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "8px 24px",
          width: '100%',
          maxWidth: 400,
          flexDirection: 'column',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Reset Password
        </Typography>
        <Box sx={{ width: '100%', height: '1px', backgroundColor: 'grey' }}></Box>

        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '16px' }}>
          <Stack spacing={2}>
            <TextField
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmPasswordError) setConfirmPasswordError('');
              }}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleToggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Reset Password
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => navigate('/')}
            >
              Home
            </Button>
          </Stack>
        </form>
      </Paper>

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
    </Container>
  );
};

export default ResetPassword;
