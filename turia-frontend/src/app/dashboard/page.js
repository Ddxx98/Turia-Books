"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Container,
    Grid,
    TextField,
    Button,
    Typography,
    Paper,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    MenuItem,
    Stack,
    AppBar,
    Toolbar,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import {
    People as PeopleIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Warning as WarningIcon,
    Logout as LogoutIcon,
    Dashboard as DashboardIcon,
    Settings as SettingsIcon,
    Menu as MenuIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import SettingsForm from '../../components/SettingsForm';

const drawerWidth = 240;

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalEmployees: 0,
        presentToday: 0,
        onTimeToday: 0,
        lateToday: 0,
        attendanceRate: 0
    });
    const [attendance, setAttendance] = useState([]);
    const [filters, setFilters] = useState({
        date: new Date().toISOString().split('T')[0],
        name: '',
        status: ''
    });

    const fetchStats = async (token) => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analytics`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data);
        } catch (error) {
            console.error("Error fetching stats", error);
        }
    };

    const fetchAttendance = async (token) => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/attendance`, {
                params: filters,
                headers: { Authorization: `Bearer ${token}` }
            });
            setAttendance(res.data);
        } catch (error) {
            console.error("Error fetching attendance", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token || role !== 'admin') {
            window.location.href = '/attendance';
            return;
        }

        fetchStats(token);
        fetchAttendance(token);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && activeTab === 'dashboard') {
            fetchAttendance(token);
        }
    }, [filters, activeTab]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/attendance';
    };

    const statsCards = [
        {
            title: 'Total Employees',
            value: stats.totalEmployees,
            icon: <PeopleIcon sx={{ fontSize: 40 }} />,
            description: 'Registered employees',
            color: '#2196f3',
            bgcolor: '#e3f2fd'
        },
        {
            title: 'Present Today',
            value: stats.presentToday,
            icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
            description: `${stats.attendanceRate}% attendance rate`,
            color: '#4caf50',
            bgcolor: '#e8f5e9'
        },
        {
            title: 'On Time',
            value: stats.onTimeToday,
            icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
            description: 'Arrived before 9:10 AM',
            color: '#ff9800',
            bgcolor: '#fff3e0'
        },
        {
            title: 'Late',
            value: stats.lateToday,
            icon: <WarningIcon sx={{ fontSize: 40 }} />,
            description: 'Arrived after 9:10 AM',
            color: '#f44336',
            bgcolor: '#ffebee'
        },
    ];

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#1976d2', color: 'white' },
                }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" fontWeight="bold">
                        Turia Admin
                    </Typography>
                </Toolbar>
                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            selected={activeTab === 'dashboard'}
                            onClick={() => setActiveTab('dashboard')}
                            sx={{
                                '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.2)' },
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'white' }}>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            selected={activeTab === 'settings'}
                            onClick={() => setActiveTab('settings')}
                            sx={{
                                '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.2)' },
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'white' }}>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Settings" />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Box sx={{ flexGrow: 1 }} />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                            <ListItemIcon sx={{ color: 'white' }}>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar /> {/* Spacer for AppBar if we had one, or just top spacing */}

                {activeTab === 'dashboard' ? (
                    <Stack spacing={4}>
                        <Typography variant="h4" fontWeight="bold" color="text.primary">
                            Dashboard Overview
                        </Typography>

                        {/* Stats Cards */}
                        <Grid container spacing={3}>
                            {statsCards.map((stat, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            transition: 'transform 0.3s, box-shadow 0.3s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 4,
                                            },
                                        }}
                                    >
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        {stat.title}
                                                    </Typography>
                                                    <Typography variant="h4" fontWeight="bold">
                                                        {stat.value}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        bgcolor: stat.bgcolor,
                                                        color: stat.color,
                                                    }}
                                                >
                                                    {stat.icon}
                                                </Box>
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {stat.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Attendance Records */}
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                            <Stack spacing={3}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                    <Typography variant="h5" fontWeight="bold">
                                        Attendance Records
                                    </Typography>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <TextField
                                            type="date"
                                            name="date"
                                            value={filters.date}
                                            onChange={handleFilterChange}
                                            size="small"
                                            sx={{ minWidth: 180 }}
                                        />
                                        <TextField
                                            placeholder="Search employee..."
                                            name="name"
                                            value={filters.name}
                                            onChange={handleFilterChange}
                                            size="small"
                                            sx={{ minWidth: 200 }}
                                        />
                                        <TextField
                                            select
                                            name="status"
                                            value={filters.status}
                                            onChange={handleFilterChange}
                                            size="small"
                                            sx={{ minWidth: 150 }}
                                        >
                                            <MenuItem value="">All Status</MenuItem>
                                            <MenuItem value="on-time">On Time</MenuItem>
                                            <MenuItem value="late">Late</MenuItem>
                                            <MenuItem value="early">Early</MenuItem>
                                        </TextField>
                                    </Stack>
                                </Box>

                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                                <TableCell><strong>Employee</strong></TableCell>
                                                <TableCell><strong>Date</strong></TableCell>
                                                <TableCell><strong>Punch In</strong></TableCell>
                                                <TableCell><strong>Punch Out</strong></TableCell>
                                                <TableCell><strong>Total Hours</strong></TableCell>
                                                <TableCell><strong>Status</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {attendance.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center">
                                                        <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                                                            No attendance records found
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                attendance.map((record) => (
                                                    <TableRow key={record.id} hover>
                                                        <TableCell>{record.Employee?.name || 'N/A'}</TableCell>
                                                        <TableCell>{record.date ? format(new Date(record.date), 'MMM dd, yyyy') : 'N/A'}</TableCell>
                                                        <TableCell>{record.punchInTime ? format(new Date(record.punchInTime), 'hh:mm a') : '-'}</TableCell>
                                                        <TableCell>{record.punchOutTime ? format(new Date(record.punchOutTime), 'hh:mm a') : '-'}</TableCell>
                                                        <TableCell>{record.totalHours ? `${record.totalHours.toFixed(2)} hrs` : '-'}</TableCell>
                                                        <TableCell>
                                                            <Box
                                                                component="span"
                                                                sx={{
                                                                    px: 2,
                                                                    py: 0.5,
                                                                    borderRadius: 1,
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 'bold',
                                                                    bgcolor: record.status === 'on-time' ? '#e8f5e9' : record.status === 'late' ? '#ffebee' : '#fff3e0',
                                                                    color: record.status === 'on-time' ? '#2e7d32' : record.status === 'late' ? '#c62828' : '#e65100',
                                                                }}
                                                            >
                                                                {record.status || 'N/A'}
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Stack>
                        </Paper>
                    </Stack>
                ) : (
                    <Container maxWidth="md">
                        <SettingsForm />
                    </Container>
                )}
            </Box>
        </Box>
    );
}
