import React from 'react';
import { Container, Typography, Box, Link } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';

const ShowRecordingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { apiResponse } = location.state || {};
  if (!apiResponse) {
    navigate('/');
    return null;
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Recording Playback
      </Typography>
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h6">Format: {apiResponse.format}</Typography>
        <Link href={apiResponse.url} target="_blank" rel="noopener noreferrer" color="primary">
          Stream URL
        </Link>
        <Box sx={{ marginTop: 4 }}>
          <ReactPlayer url={apiResponse.url} controls width="100%" height="500px" />
        </Box>
      </Box>
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6">Stream Controls:</Typography>
        <ul>
          <li>
            <Link href={apiResponse.stream_controls.play} target="_blank" rel="noopener noreferrer">
              Play
            </Link>
          </li>
          <li>
            <Link href={apiResponse.stream_controls.pause} target="_blank" rel="noopener noreferrer">
              Pause
            </Link>
          </li>
          <li>
            <Link href={apiResponse.stream_controls.speed} target="_blank" rel="noopener noreferrer">
              Adjust Speed
            </Link>
          </li>
        </ul>
      </Box>
    </Container>
  );
};

export default ShowRecordingPage;

