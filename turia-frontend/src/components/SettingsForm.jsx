import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Stack,
    Alert,
    CircularProgress
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

export default function SettingsForm() {
    const [settings, setSettings] = useState({
        startTime: '09:00',
        endTime: '18:00',
        graceTime: 10
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data) {
                setSettings({
                    startTime: res.data.startTime,
                    endTime: res.data.endTime,
                    graceTime: res.data.graceTime
                });
            }
        } catch (error) {
            console.error("Error fetching settings", error);
            setMessage({ type: 'error', text: 'Failed to load settings' });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings`, settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
        } catch (error) {
            console.error("Error updating settings", error);
            setMessage({ type: 'error', text: 'Failed to update settings' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Business Hours Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure the standard working hours and grace period for attendance tracking.
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3} maxWidth="sm">
                    <TextField
                        label="Start Time"
                        type="time"
                        name="startTime"
                        value={settings.startTime}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        required
                    />

                    <TextField
                        label="End Time"
                        type="time"
                        name="endTime"
                        value={settings.endTime}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        required
                    />

                    <TextField
                        label="Grace Time (minutes)"
                        type="number"
                        name="graceTime"
                        value={settings.graceTime}
                        onChange={handleChange}
                        fullWidth
                        required
                        helperText="Additional time allowed after start time before marking as 'Late'"
                    />

                    {message && (
                        <Alert severity={message.type} onClose={() => setMessage(null)}>
                            {message.text}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        disabled={loading}
                        sx={{ alignSelf: 'flex-start' }}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
}
