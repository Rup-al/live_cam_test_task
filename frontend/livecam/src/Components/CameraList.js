import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Link,
  Skeleton,
  Box,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

const CameraList = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const token = localStorage.getItem('token');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/cameras/`;
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCameras(response.data.results);
      } catch (error) {
        if (error.response && error.response.status === 500) {
          localStorage.removeItem('token');
          navigate('/');
        } else {
          console.error('There was an error fetching the cameras!', error);
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCameras();
  }, [token, navigate]);

  const handleCameraClick = (camera) => {
    setSelectedCamera(camera);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

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

  const handleSubmit = async () => {
    setLoadingData(true);
    setOpenDialog(false);
    if (!selectedCamera) return;

    const body = {
      action: 'play',
      speed: 1.5,
      recording_id: selectedCamera.id,
      start: startDate,
      end: endDate
    };
    console.log(body);
    if(startDate > endDate){
      setSnackbarMessage('End date should be greater than start date');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      
    }
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/recording/control/`;
      const response = await axios.post(apiUrl, body, {
        headers: {
          //Authorization: `PersonalAccessToken ${process.env.REACT_APP_PERSONAL_ACCESS_TOKEN}`,
        },
      });
      console.log(response);
      navigate('/show-recording', { state: { apiResponse: response.data } });
    } catch (error) {
      setSnackbarMessage('Recording not found !!!');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      console.error('There was an error fetching the recording!', error);
    } finally {
      setOpenDialog(false);
      setLoadingData(false);
    }
  };

  const categorizedCameras = cameras.reduce((acc, camera) => {
    const category = camera.location || 'Camera List';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(camera);
    return acc;
  }, {});

  const renderSkeletons = () => (
    <Grid container spacing={4}>
      {[...Array(3)].map((_, idx) => (
        <Grid item xs={12} sm={6} md={4} key={idx}>
          <Skeleton variant="rectangular" height={200} />
          <Box sx={{ pt: 0.5 }}>
            <Skeleton width="80%" />
            <Skeleton width="60%" />
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  const renderCameraList = () => (
    <Grid container spacing={4}>
      {Object.keys(categorizedCameras).map((category) => (
        <Grid item xs={12} key={category}>
          <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: 2, marginBottom: 4 }}>
            <Typography variant="h5" gutterBottom>
              {category}
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Grid container spacing={2}>
              {categorizedCameras[category].map((camera) => (
                <Grid item xs={12} key={camera.id}>
                  <Box
                    sx={{ padding: 2, backgroundColor: '#fff', borderRadius: 2, boxShadow: 1, cursor: 'pointer' }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {camera.name}
                    </Typography>
                    <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                      <CardMedia
                        component="img"
                        image={camera.snapshot.url}
                        alt={camera.name}
                        sx={{ height: 140, objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography variant="body2" color="textSecondary">
                          Status: {camera.status}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Type: {camera.type}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Audio Enabled: {camera.audio_enabled ? 'Yes' : 'No'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Low Latency Enabled: {camera.low_latency_enabled ? 'Yes' : 'No'}
                        </Typography>
                        <Link
                          href={camera.live_snapshot}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="primary"
                          sx={{ display: 'block', marginTop: 1 }}
                        >
                          Live Snapshot
                        </Link>
                        <Link
                          onClick={() => handleCameraClick(camera)}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="primary"
                          sx={{ display: 'block', marginTop: 1 }}
                        >
                          View Recording
                        </Link>
                        <Box sx={{ marginTop: 2 }}>
                          {camera.streams.length > 0 ? (
                            <Grid container spacing={2}>
                              {camera.streams.map((stream, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                  <Box sx={{ marginBottom: 2 }}>
                                    {stream.format === 'mjpeg' ? (
                                      <Box>
                                        <img
                                          src={stream.url}
                                          alt={`Stream ${index}`}
                                          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                        />
                                        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                                          Stream Format: {stream.format}
                                        </Typography>
                                      </Box>
                                    ) : (
                                      <ReactPlayer
                                        url={stream.url}
                                        controls
                                        width="100%"
                                        height="200px"
                                        config={{
                                          file: {
                                            attributes: {
                                              controlsList: 'nodownload', // Disable download button
                                            },
                                          },
                                        }}
                                      />
                                    )}
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              No streams available.
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Container sx={{ marginTop: 4 }}>
      {loadingData && <CircularColor />}
      {loading ? (
        renderSkeletons()
      ) : (
        renderCameraList()
      )}

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Set Date and Time Range</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select the start and end date and time for the recording you want to view.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="start-date"
            label="Start Date and Time"
            type="datetime-local"
            fullWidth
            variant="standard"
            value={startDate}
            onChange={handleStartDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            id="end-date"
            label="End Date and Time"
            type="datetime-local"
            fullWidth
            variant="standard"
            value={endDate}
            onChange={handleEndDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CameraList;
