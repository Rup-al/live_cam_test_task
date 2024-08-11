import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';

const ServerError = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <ErrorOutlineIcon color="error" sx={{ fontSize: 80 }} />
      <Typography variant="h3" gutterBottom>
        500
      </Typography>
      <Typography variant="h5" gutterBottom>
        Internal Server Error
      </Typography>
      <Typography variant="body1" gutterBottom>
        Something went wrong on our end. Please try again later.
      </Typography>
      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleRetry} sx={{ mr: 2 }}>
          Retry
        </Button>
        <Button variant="outlined" color="primary" onClick={handleGoHome}>
          Go Home
        </Button>
      </Box>
    </Container>
  );
};

export default ServerError;
