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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  leavesLeft: number;
}

const Signup: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'EMPLOYEE',
    leavesLeft: 30,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setFormData({ ...formData, email: value });
    if (value) {
      validateEmail(value);
    } else {
      setEmailError('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const name = e.target.name as keyof SignupFormData;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate email before submitting
    if (!validateEmail(formData.email)) {
      return;
    }

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await authAPI.signup(formData);
      setSuccess(`User ${formData.firstName} ${formData.lastName} created successfully!`);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'EMPLOYEE',
        leavesLeft: 30,
      });
    } catch (err: any) {
      if (err.response?.data?.error === 'Email already exists') {
        setError('A user with this email address already exists');
      } else if (err.response?.data?.email) {
        setEmailError(err.response.data.email);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Only managers can access this page
  if (user?.role !== 'MANAGER') {
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
          <Alert severity="error">
            Access denied. Only managers can create new users.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
            <PersonAdd sx={{ mr: 1, fontSize: 32 }} />
            <Typography component="h1" variant="h4">
              Create New User
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Box>

            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError || 'Only Gmail addresses (@gmail.com) are allowed'}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                helperText="Minimum 6 characters"
              />
              <FormControl fullWidth>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as string })}
                >
                  <MenuItem value="EMPLOYEE">Employee</MenuItem>
                  <MenuItem value="MANAGER">Manager</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              type="number"
              id="leavesLeft"
              label="Initial Leave Balance"
              name="leavesLeft"
              value={formData.leavesLeft}
              onChange={handleChange}
              inputProps={{ min: 0, max: 365 }}
              helperText="Number of leave days"
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create User'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
