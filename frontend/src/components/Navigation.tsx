import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { ExitToApp, Dashboard } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Dashboard sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Travel & Leave System
        </Typography>
        {user && (
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1">
              {user.firstName} {user.lastName} ({user.role})
            </Typography>
            <Button color="inherit" startIcon={<ExitToApp />} onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
