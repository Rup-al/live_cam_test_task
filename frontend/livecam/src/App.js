import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import CameraList from './Components/CameraList';
import VideoDisplay from './Components/VideoDisplay';
import Login from './Components/Login';
import Register from './Components/Register';
import NavBar from './Components/Navbar';
import ServerError from './Components/ServerError';
import ShowRecordingPage from './Components/ShowRecordingPage';
import ForgotPassword from './Components/ForgotPassword';
import PasswordResetForm from './Components/PasswordResetForm'

const Layout = ({ username }) => {
  const location = useLocation();
  const shouldHideNavBar = location.pathname === '/' || location.pathname === '/register';

  return (
    <>
      {!shouldHideNavBar && <NavBar username={username} />}
      <Routes>
        <Route path="/cameras" element={<CameraList />} />
        <Route path="show-recording" element={<ShowRecordingPage />} />
        <Route path="/live/:id" element={<VideoDisplay />} />
      </Routes>
    </>
  );
};

const App = () => {
  
 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password-confirm" element={<PasswordResetForm/>} />
        <Route path="/server-error" element={<ServerError />} />
        <Route path="*" element={<Layout />} />
      </Routes>
    </Router>
  );
};

export default App;
