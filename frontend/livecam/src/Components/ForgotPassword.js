import React, { useState } from 'react';
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
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
 
  const CircularColor = () => (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 1200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress color="inherit" />
    </Box>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (hasError) {
      return;
    }
    setLoadingData(true);

    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/forgot-password/`;
      await axios.post(apiUrl, {
        email,
      });

      setSnackbarMessage(`Recovery link sent to ${email}`);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setIsSubmitted(true);
      setLoadingData(false);
    } catch (error) {
      if (error.message === 'Network Error') {
        navigate('/server-error');
      } else {
        setSnackbarMessage("Failed to send recovery link or Email doesn't exist");
        setSnackbarSeverity('error');
        setLoadingData(false);
        setOpenSnackbar(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleLoginNavigate = () => {
    navigate('/login');
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
      {loadingData && <CircularColor />}
      <Paper
        elevation={3}
        sx={{
          padding: "16px 24px",
          width: '100%',
          maxWidth: 400,
          flexDirection: 'column',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        {isSubmitted ? (
          <Box sx={{ textAlign: 'center' }}>
            {/* <CheckCircleIcon color="success" sx={{ fontSize: 50, mb: 2 }} /> */}
            <Typography variant="h5" gutterBottom>
              Success!
            </Typography>
            <Typography variant="body1">
              A recovery link has been sent to <strong>{email}</strong>.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleLoginNavigate}
            >
              Go to Login
            </Button>
          </Box>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Forgot Password
            </Typography>
            <Box sx={{ width: '100%', height: '1px', backgroundColor: 'grey', mb: 2 }}></Box>
            <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '16px' }}>
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  error={!!emailError}
                  helperText={emailError}
                  sx={{
                    '& .MuiInputLabel-root': {
                      lineHeight: '14px',
                    },
                    '& .MuiInputBase-root': {
                      height: 42,
                    },
                    '& .MuiFormHelperText-root': {
                      marginLeft: 0,
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Send Recovery Link
                </Button>
                <Button
                  variant="text"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={handleLoginNavigate}
                >
                  Back to Login
                </Button>
              </Stack>
            </form>
          </>
        )}
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

export default ForgotPassword;

