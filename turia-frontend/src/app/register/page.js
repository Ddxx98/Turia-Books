"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as yup from 'yup';
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    Stack,
    MenuItem,
} from '@mui/material';
import {
    PersonAdd as PersonAddIcon,
    ArrowBack as ArrowBackIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const registerSchema = yup.object().shape({
    name: yup
        .string()
        .min(2, 'Name must be at least 2 characters')
        .required('Name is required'),
    email: yup
        .string()
        .email('Please enter a valid email address')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .required('Password is required'),
    role: yup
        .string()
        .oneOf(['employee', 'admin'], 'Please select a valid role')
        .required('Role is required'),
});

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'employee'
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage({ type: '', text: '' });

        try {
            await registerSchema.validate(formData, { abortEarly: false });

            setLoading(true);
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/register`, formData);
            setMessage({
                type: 'success',
                text: 'Account created successfully! Redirecting to login...'
            });
            setTimeout(() => router.push('/'), 2000);
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = {};
                error.inner.forEach(err => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            } else {
                setMessage({
                    type: 'error',
                    text: error.response?.data?.message || error.response?.data?.error || 'Registration failed. Please try again.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: 4,
            }}
        >
            <Container maxWidth="sm">
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        sx={{ mb: 3, color: 'white' }}
                    >
                        Back to Login
                    </Button>
                </Link>

                <Paper
                    elevation={8}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                p: 2,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                mb: 2,
                            }}
                        >
                            <PersonAddIcon sx={{ fontSize: 48, color: 'white' }} />
                        </Box>
                        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                            Create Account
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Join Turia Attendance System today
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleRegister}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                variant="outlined"
                            />

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
                                helperText={errors.password || '6+ characters, 1 uppercase, 1 number required'}
                                variant="outlined"
                            />

                            <TextField
                                fullWidth
                                select
                                label="Account Type"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                error={!!errors.role}
                                helperText={errors.role}
                                variant="outlined"
                            >
                                <MenuItem value="employee">Employee</MenuItem>
                                <MenuItem value="admin">Administrator</MenuItem>
                            </TextField>

                            {message.text && (
                                <Alert severity={message.type === 'success' ? 'success' : 'error'} icon={message.type === 'success' ? <CheckCircleIcon /> : undefined}>
                                    {message.text}
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                startIcon={<PersonAddIcon />}
                                sx={{
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                    },
                                }}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>

                            <Typography variant="body2" align="center" color="text.secondary">
                                Already have an account?{' '}
                                <Link href="/" style={{ color: '#667eea', fontWeight: 'bold', textDecoration: 'none' }}>
                                    Sign in
                                </Link>
                            </Typography>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
