import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!email.includes('@')) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    if (!email.endsWith('@gmail.com')) {
      setEmailError('Only Gmail addresses are allowed');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value) {
      validateEmail(value);
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email before submitting
    if (!validateEmail(email)) {
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.data?.error === 'User not found') {
        setError('User not found. Please check your email address.');
      } else if (err.response?.data?.email) {
        setEmailError(err.response.data.email);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Employee Travel & Leave System
          </Typography>
          <Typography component="h2" variant="h5" align="center" gutterBottom>
            Sign In
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError || 'Only Gmail addresses (@gmail.com) are allowed'}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Box>

          {/* <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Demo Accounts (Gmail only):
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manager: manager@gmail.com / password123
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Employee: alice@gmail.com / password123
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Employee: bob@gmail.com / password123
            </Typography>
          </Box> */}
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
