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
  IconButton,
  InputAdornment,
  Paper,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

   
    if (!firstName) {
      setFirstNameError('First name is required');
      hasError = true;
    } else {
      setFirstNameError('');
    }

    if (!lastName) {
      setLastNameError('Last name is required');
      hasError = true;
    } else {
      setLastNameError('');
    }

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

    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    } else {
      setConfirmPasswordError('');
    }

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

    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/register/`;
      await axios.post(apiUrl, {
        first_name: firstName,
        last_name: lastName,
        username,
        password,
        password2 : confirmPassword,
        email,
      });

      setSnackbarMessage('Registration successful!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setOpenSuccessDialog(true);
    } catch (error) {
      if(error.message === "Network Error"){
        navigate('/server-error')

      }else{
      if(error.response.data.username){
      setSnackbarMessage(error.response.data.username[0]);
      }else if(error.response.data.email){
      setSnackbarMessage(error.response.data.email[0]);
      }else if(error.response.data.password){
        setSnackbarMessage(error.response.data.password[0]);
      }
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleLoginRedirect = () => {
    navigate('/');
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
          display: openSuccessDialog ? 'none' : 'flex', 
        }}
      >
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Stack spacing={2}>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (firstNameError) setFirstNameError('');
              }}
              error={!!firstNameError}
              helperText={firstNameError}
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
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (lastNameError) setLastNameError('');
              }}
              error={!!lastNameError}
              helperText={lastNameError}
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
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (usernameError) setUsernameError('');
              }}
              error={!!usernameError}
              helperText={usernameError}
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
            <TextField
              label="Password"
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
                '& .MuiFormHelperText-root': {
                  marginLeft: 0, 
                },
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
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                '& .MuiFormHelperText-root': {
                  marginLeft: 0,
                },
              }}
            />
            <TextField
              label="Email"
              type="email"
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
              Register
            </Button>
          </Stack>
        </form>
        <Stack spacing={1} sx={{ marginTop: 2, width: '100%' }} alignItems="center">
          <Link onClick={handleLoginRedirect} variant="body2" sx={{ cursor: 'pointer' }}>
            Already have an account? Login
          </Link>
        </Stack>
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

      <Dialog
        open={openSuccessDialog}
        onClose={() => {}} 
        maxWidth="xs"
        fullWidth
        sx={{ 
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <DialogTitle>Registration Successful</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You have successfully registered. You can now log in with your credentials.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoginRedirect} color="primary">
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Register;

