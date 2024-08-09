import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Menu, MenuItem, Button, Avatar, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    tokenId: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({
          firstName: decodedToken.firstName,
          lastName: decodedToken.lastName,
          email: decodedToken.email,
          username: decodedToken.username,
          tokenId: decodedToken.tokenId,
        });
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async() => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/logout/`;
        await axios.post(apiUrl, { refresh: refreshToken });
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        navigate('/');
      } catch (error) {
        console.error('Logout failed:', error);
        navigate('/');
      }
    } else {
      console.error('No refresh token found');
      navigate('/');
    }
  };
  const handleNavigateCamera = async() => {
    navigate('/cameras')
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography onClick={()=>{handleNavigateCamera()}} variant="h6" sx={{ flexGrow: 1 }}>
          Live Cam
        </Typography>
        <Button
          aria-controls="profile-menu"
          aria-haspopup="true"
          onClick={handleMenuOpen}
          color="inherit"
          endIcon={<Avatar>{user.firstName}</Avatar>}
        >
          {user.username}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem disabled>
            <Typography variant="body2">Email : {user.email}</Typography>
          </MenuItem>
          <MenuItem disabled>
            <Typography variant="body2">Username : {user.username}</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
