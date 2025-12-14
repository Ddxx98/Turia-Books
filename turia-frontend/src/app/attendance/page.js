"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import Link from 'next/link';
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    Stack,
    Grid,
} from '@mui/material';
import {
    Login as LoginIcon,
    Logout as LogoutIcon,
    AccessTime as ClockIcon,
} from '@mui/icons-material';

export default function AttendancePage() {
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
        if (storedToken) {
            setToken(storedToken);
            fetchSettings(storedToken);
        }

        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchSettings = async (authToken) => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setSettings(res.data);
        } catch (error) {
            console.error("Error fetching settings", error);
            handleLogout(); // Redirect to login on error
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, { email, password });
            const { token, role } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            setToken(token);

            if (role === 'admin') {
                window.location.href = '/dashboard';
            } else {
                setMessage('');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePunch = async (type) => {
        setLoading(true);
        setMessage('');
        try {
            const endpoint = type === 'in' ? '/api/punchIn' : '/api/punchOut';
            const body = {
                date: new Date().toISOString().split('T')[0],
                [type === 'in' ? 'punchInTime' : 'punchOutTime']: new Date().toISOString()
            };

            console.log('Sending punch request:', { endpoint, body, token });

            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, body, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage(`Successfully punched ${type}!`);
        } catch (error) {
            console.error('Punch error:', error.response?.data);
            setMessage(error.response?.data?.message || error.response?.data?.error || `Punch ${type} failed`);
            if (error.response?.status === 401 || error.response?.status === 403) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setToken(null);
        setEmail('');
        setPassword('');
        setMessage('');
    };

    if (!token) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#f5f5f5',
                }}
            >
                <Container maxWidth="sm">
                    <Paper elevation={8} sx={{ p: 4, borderRadius: 3 }}>
                        <Typography variant="h4" component="h1" align="center" gutterBottom fontWeight="bold">
                            Employee Login
                        </Typography>
                        <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    variant="outlined"
                                />
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    variant="outlined"
                                />
                                {message && <Alert severity="error">{message}</Alert>}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    sx={{ py: 1.5 }}
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </Button>
                                <Typography variant="body2" align="center" color="text.secondary">
                                    Don't have an account?{' '}
                                    <Link href="/register" style={{ color: '#1976d2', fontWeight: 'bold', textDecoration: 'none' }}>
                                        Register
                                    </Link>
                                </Typography>
                            </Stack>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f5f5f5',
                p: 2,
            }}
        >
            <Container maxWidth="sm">
                <Paper elevation={8} sx={{ p: 4, borderRadius: 3 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <ClockIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
                        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                            {format(currentTime, 'hh:mm:ss a')}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            {format(currentTime, 'EEEE, MMMM dd, yyyy')}
                        </Typography>
                        {settings && (
                            <Paper elevation={0} sx={{ bgcolor: '#e3f2fd', p: 2, mt: 2, borderRadius: 2, display: 'inline-block' }}>
                                <Typography variant="subtitle1" color="primary" fontWeight="bold">
                                    Office Hours: {settings.startTime} - {settings.endTime}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Grace Time: {settings.graceTime} mins
                                </Typography>
                            </Paper>
                        )}
                    </Box>

                    <Stack spacing={3}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={() => handlePunch('in')}
                                    disabled={loading}
                                    startIcon={<LoginIcon />}
                                    sx={{
                                        height: 120,
                                        flexDirection: 'column',
                                        gap: 1,
                                        fontSize: '1.1rem',
                                        bgcolor: '#4caf50',
                                        '&:hover': { bgcolor: '#45a049' },
                                    }}
                                >
                                    Punch In
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="large"
                                    onClick={() => handlePunch('out')}
                                    disabled={loading}
                                    startIcon={<LogoutIcon />}
                                    sx={{
                                        height: 120,
                                        flexDirection: 'column',
                                        gap: 1,
                                        fontSize: '1.1rem',
                                        borderColor: '#f44336',
                                        color: '#f44336',
                                        '&:hover': {
                                            borderColor: '#d32f2f',
                                            bgcolor: 'rgba(244, 67, 54, 0.04)',
                                        },
                                    }}
                                >
                                    Punch Out
                                </Button>
                            </Grid>
                        </Grid>

                        {message && (
                            <Alert
                                severity={message.includes('failed') || message.includes('Already') ? 'error' : 'success'}
                            >
                                {message}
                            </Alert>
                        )}

                        <Button
                            variant="text"
                            onClick={handleLogout}
                            sx={{ color: 'text.secondary' }}
                        >
                            Sign out
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}
