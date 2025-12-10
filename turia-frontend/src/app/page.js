"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as yup from 'yup';
import {
  Box,
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  Alert,
  Stack,
} from '@mui/material';
import {
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    try {
      await loginSchema.validate(formData, { abortEarly: false });

      setLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, formData);
      const { token, role } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      if (role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/attendance');
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = {};
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        setMessage(error.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <ScheduleIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Turia Attendance
          </Typography>
          <Link href="/register" style={{ textDecoration: 'none' }}>
            <Button
              variant="outlined"
              startIcon={<PersonAddIcon />}
              sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Create Account
            </Button>
          </Link>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={2} justifyContent="center">
          {/* Login Form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={8}
              sx={{
                p: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    mb: 2,
                  }}
                >
                  <LoginIcon sx={{ fontSize: 48, color: 'white' }} />
                </Box>
                <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                  Welcome Back
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Sign in to access your workspace
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleLogin} sx={{ bgcolor: 'white', p: 3, borderRadius: 2 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    variant="outlined"
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    variant="outlined"
                  />

                  {message && (
                    <Alert severity="error">{message}</Alert>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={<LoginIcon />}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                      },
                    }}
                  >
                    {loading ? 'Signing in...' : 'Sign In Now'}
                  </Button>

                  <Typography variant="body2" align="center" color="text.secondary">
                    Don't have an account?{' '}
                    <Link href="/register" style={{ color: '#667eea', fontWeight: 'bold', textDecoration: 'none' }}>
                      Create one now
                    </Link>
                  </Typography>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: '#1976d2', color: 'white', py: 3, mt: 8 }}>
        <Container>
          <Typography variant="body2" align="center">
            © 2025 Turia Attendance System. Crafted with ❤ using Next.js & PostgreSQL
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
