import axios from 'axios';

const verifyCredentials = async () => {
    try {
        console.log('Testing login with provided credentials...');
        const res = await axios.post('http://localhost:3001/api/login', {
            email: 'deexith2016@gmail.com',
            password: 'Deexith2026'
        });
        console.log('Login successful!');
        console.log('User Role:', res.data.role);
        console.log('Token received.');
    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
    }
};

verifyCredentials();
