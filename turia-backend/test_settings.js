import axios from 'axios';

const testSettings = async () => {
    try {
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:3001/api/login', {
            email: 'deexith2016@gmail.com',
            password: 'Deexith2026'
        });
        const token = loginRes.data.token;
        console.log('Login successful. Token received.');

        console.log('Fetching current settings...');
        const getRes = await axios.get('http://localhost:3001/api/settings', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Current Settings:', getRes.data);

        console.log('Updating settings...');
        const newSettings = {
            startTime: "10:00",
            endTime: "19:00",
            graceTime: 15
        };
        const putRes = await axios.put('http://localhost:3001/api/settings', newSettings, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Settings updated:', putRes.data);

        console.log('Verifying update...');
        const verifyRes = await axios.get('http://localhost:3001/api/settings', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (verifyRes.data.startTime === "10:00" && verifyRes.data.graceTime === 15) {
            console.log('Verification SUCCESS: Settings persisted correctly.');
        } else {
            console.error('Verification FAILED: Settings do not match.');
        }

    } catch (error) {
        console.error('Test failed:', error.response ? error.response.data : error.message);
    }
};

testSettings();
