import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import EmployeeDashboard from './EmployeeDashboard';
import ManagerDashboard from './ManagerDashboard';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          User not found. Please log in again.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {user.role === 'EMPLOYEE' ? <EmployeeDashboard /> : <ManagerDashboard />}
    </Container>
  );
};

export default Dashboard;
